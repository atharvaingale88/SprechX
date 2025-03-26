from flask import Flask, jsonify, request
from flask_cors import CORS
from deso_sdk import DeSoDexClient, base58_check_encode, base58
import os
import sqlite3
from dotenv import load_dotenv
from pathlib import Path
from cryptography.fernet import Fernet

dotenv_path = Path(__file__).parent / 'secure' / '.env'
load_dotenv(dotenv_path)

ENCRYPTION_KEY = os.getenv('ENCRYPTION_KEY')
fernet = Fernet(ENCRYPTION_KEY)

app = Flask(__name__)
CORS(app)

try:
    # Initialize client with all required parameters
    deso_client = DeSoDexClient(
        is_testnet=os.getenv("DESO_TESTNET", "true").lower() == "true",
        seed_phrase_or_hex=os.getenv("DESO_SEED_PHRASE_OR_HEX"),
        passphrase=os.getenv("DESO_PASSPHRASE", ""),
        index=int(os.getenv("DESO_INDEX", "0")),
        node_url=os.getenv("DESO_NODE_URL", "https://test.deso.org")
    )
    print("Client initialized successfully!")
except Exception as e:
    print(f"Initialization failed: {str(e)}")
    deso_client = None

def get_client_by_public_key(publickey):
    """Get a DeSoDexClient using the user's encrypted seed"""
    try:
        db_path = os.path.join(os.path.dirname(__file__), 'secure', 'key_seed.db')
        conn = sqlite3.connect(db_path)
        c = conn.cursor()
        c.execute('SELECT seedphrase FROM user_storage WHERE publickey = ?', (publickey,))
        row = c.fetchone()
        conn.close()

        if not row:
            raise Exception("Seed not found for this public key")

        decrypted_seed = fernet.decrypt(row[0].encode()).decode()

        return DeSoDexClient(
            is_testnet=os.getenv("DESO_TESTNET", "true").lower() == "true",
            seed_phrase_or_hex=decrypted_seed,
            passphrase=os.getenv("DESO_PASSPHRASE", ""),
            index=int(os.getenv("DESO_INDEX", "0")),
            node_url=os.getenv("DESO_NODE_URL", "https://test.deso.org")
        )

    except Exception as e:
        raise Exception(f"Failed to create client: {str(e)}")

def get_encoded_public_key(client):
    """Helper function to get properly encoded public key"""
    return base58_check_encode(
        client.deso_keypair.public_key,
        client.is_testnet
    )

@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        public_key = request.args.get('publickey')
        client = deso_client

        if public_key:
            try:
                client = get_client_by_public_key(public_key)
            except Exception as e:
                return jsonify({"error": f"User client failed: {str(e)}"}), 500

        return jsonify({
            "status": "running",
            "network": "testnet",
            "public_key": get_encoded_public_key(client)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/balance', methods=['GET'])
def get_balance():
    try:
        public_key = request.args.get('publickey')
        client = deso_client
        
        if public_key:
            try:
                client = get_client_by_public_key(public_key)
            except Exception as e:
                return jsonify({"error": f"User client failed: {str(e)}"}), 500

        balances = client.get_token_balances(
            user_public_key=get_encoded_public_key(client),
            creator_public_keys=["DESO"]
        )

        deso_balance = client.base_units_to_coins(
            int(balances['Balances']['DESO']['BalanceBaseUnits']),
            is_deso=True
        )

        return jsonify({
            "deso_balance": deso_balance,
            "public_key": get_encoded_public_key(client)
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/profile', methods=['GET'])
def get_profile():
    try:
        public_key = request.args.get('publickey')
        client = deso_client

        if public_key:
            try:
                client = get_client_by_public_key(public_key)
            except Exception as e:
                return jsonify({"error": f"User client failed: {str(e)}"}), 500

        profile = client.get_single_profile(
            public_key_base58check=get_encoded_public_key(client)
        )

        return jsonify({"profile": profile})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/user-exists', methods=['GET'])
def check_user_exists():
    try:
        user_exists = False
        public_key = request.args.get('publickey')
        if not public_key:
            return jsonify({"error": "Missing public key"}), 400
        
        db_path = os.path.join(os.path.dirname(__file__), 'secure', 'key_seed.db')
        conn = sqlite3.connect(db_path)
        c = conn.cursor()

        c.execute('SELECT publickey, seedphrase FROM user_storage WHERE publickey = ?', (public_key,))
        row = c.fetchone()
        if row and row[0] == public_key and row[1] is not None:
            user_exists = True
        conn.close()
        
        return jsonify({
            "user_exists": user_exists,
            "publickey": public_key
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/posts', methods=['GET'])
def get_posts():
    try:
        public_key = request.args.get('publickey')
        client = deso_client

        if public_key:
            try:
                client = get_client_by_public_key(public_key)
            except Exception as e:
                return jsonify({"error": f"User client failed: {str(e)}"}), 500

        profile = client.get_single_profile(
            public_key_base58check=get_encoded_public_key(client)
        )

        return jsonify(profile.get('Posts', []))

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/create-post', methods=['POST'])
def create_post():
    try:
        data = request.json
        public_key = data.get('publickey')
        
        if not public_key:
            return jsonify({"error": "Missing public key"}), 400
        
        user_client = get_client_by_public_key(public_key)
        encoded_public_key = get_encoded_public_key(user_client)
        
        response = user_client.submit_post(
            updater_public_key_base58check=encoded_public_key,
            body=data['content'],
            image_urls=data.get('images', []),
            video_urls=data.get('videos', []),
            post_extra_data={"platform": "SprechX"}
        )
        
        signed = user_client.sign_and_submit_txn(response)
        
        return jsonify({
            "submitpostresponse": response,
            "signedpostresponse": signed,
            "txn_hash": signed['TxnHashHex'],
            "explorer_link": f"https://explorer-testnet.deso.com/txn/{signed['TxnHashHex']}",
            "post": data['content']
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/save-seed', methods=['POST'])
def save_seed():
    data = request.json
    public_key = data.get('publickey')
    seed = data.get('seedPhrase')

    if not seed or len(seed.split()) < 12:
        return jsonify({'error': 'Invalid or missing seed phrase'}), 400

    try:
        '''env_path = os.path.join(os.path.dirname(__file__), 'secure', '.env')

        # Read the existing lines
        if os.path.exists(env_path):
            with open(env_path, 'r') as f:
                lines = f.readlines()
        else:
            lines = []

        # Update or add DESO_SEED_PHRASE
        updated = False
        with open(env_path, 'w') as f:
            for line in lines:
                if line.strip().startswith('DESO_SEED_PHRASE='):
                    f.write(f'DESO_SEED_PHRASE="{seed}"\n')
                    updated = True
                else:
                    f.write(line)
            if not updated:
                f.write(f'DESO_SEED_PHRASE="{seed}"\n')
            
            # Reload the updated .env
        load_dotenv(dotenv_path=env_path, override=True)'''
        
        encrypted_seed = fernet.encrypt(seed.encode()).decode()
        
        db_path = os.path.join(os.path.dirname(__file__), 'secure', 'key_seed.db')
        conn = sqlite3.connect(db_path)
        c = conn.cursor()

        # Create table if not exists
        c.execute('''
            CREATE TABLE IF NOT EXISTS user_storage (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                publickey TEXT UNIQUE,
                seedphrase TEXT
            )
        ''')

        # Insert or replace the record
        c.execute('''
            INSERT INTO user_storage (publickey, seedphrase)
            VALUES (?, ?)
            ON CONFLICT(publickey) DO UPDATE SET seedphrase=excluded.seedphrase
        ''', (public_key, encrypted_seed))

        conn.commit()
        conn.close()

        return jsonify({'message': 'Seedphrase backedup successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)