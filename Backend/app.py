from flask import Flask, jsonify, request
from flask_cors import CORS
from deso_sdk import DeSoDexClient, base58_check_encode, base58
import os
from dotenv import load_dotenv
from pathlib import Path

dotenv_path = Path(__file__).parent / 'secure' / '.env'
load_dotenv(dotenv_path)

app = Flask(__name__)
CORS(app)

try:
    # Initialize client with all required parameters
    deso_client = DeSoDexClient(
        is_testnet=os.getenv("DESO_TESTNET", "true").lower() == "true",
        seed_phrase_or_hex=os.getenv("DESO_SEED_PHRASE"),
        passphrase=os.getenv("DESO_PASSPHRASE", ""),
        index=int(os.getenv("DESO_INDEX", "0")),
        node_url=os.getenv("DESO_NODE_URL", "https://test.deso.org")
    )
    print("Client initialized successfully!")
except Exception as e:
    print(f"Initialization failed: {str(e)}")
    deso_client = None

def get_encoded_public_key():
    """Helper function to get properly encoded public key"""
    return base58_check_encode(
        deso_client.deso_keypair.public_key,
        deso_client.is_testnet
    )

@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        if not deso_client:
            return jsonify({"error": "Client not initialized"}), 500
        
        public_key_base58 = get_encoded_public_key()

        return jsonify({
            "status": "running" if deso_client else "error",
            "network": "testnet",
            "public_key": public_key_base58 if deso_client else None
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/balance', methods=['GET'])
def get_balance():
    try:
        if not deso_client:
            return jsonify({"error": "Client not initialized"}), 500
        # Get properly formatted public key
        public_key_base58 = get_encoded_public_key()
        
        balances = deso_client.get_token_balances(
            user_public_key=public_key_base58,
            creator_public_keys=["DESO"]
        )
        
        deso_balance = deso_client.base_units_to_coins(
            int(balances['Balances']['DESO']['BalanceBaseUnits']),
            is_deso=True
        )
        
        return jsonify({
            "deso_balance": deso_balance,
            "public_key": public_key_base58
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/profile', methods=['GET'])
def get_profile():
    try:
        
        if not deso_client:
            return jsonify({"error": "Client not initialized"}), 500
        
        profile = deso_client.get_single_profile(public_key_base58check = get_encoded_public_key())
        
        return jsonify({
            "profile": profile,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/posts', methods=['POST'])
def create_post():
    try:
        data = request.json
        response = deso_client.submit_post(
            updater_public_key_base58check=get_encoded_public_key(),
            body=data['content'],
            image_urls=data.get('images', []),
            video_urls=data.get('videos', []),
            post_extra_data={"platform": "SprechX"}
        )
        signed = deso_client.sign_and_submit_txn(response)
        return jsonify({
            "txn_hash": signed['TxnHashHex'],
            "explorer_link": f"https://explorer-testnet.deso.com/txn/{signed['TxnHashHex']}",
            "post": data['content']
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/posts', methods=['GET'])
def get_posts():
    try:
        profile = deso_client.get_single_profile(
            public_key_base58check=get_encoded_public_key()
        )
        return jsonify(profile.get('Posts', []))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/save-seed', methods=['POST'])
def save_seed():
    data = request.json
    seed = data.get('seedPhrase')

    if not seed or len(seed.split()) < 12:
        return jsonify({'error': 'Invalid or missing seed phrase'}), 400

    try:
        env_path = os.path.join(os.path.dirname(__file__), 'secure', '.env')

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
        load_dotenv(dotenv_path=env_path, override=True)

        return jsonify({'message': 'Seed backedup successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)