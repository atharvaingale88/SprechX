# 🔧 Setup

## 1️⃣ Backend (Python + Flask)

### <ins>To Create Python Environment and Install Dependencies run following commands in Backend directory:</ins>

#### `python -m venv venv`  # Create a virtual environment
#### `source venv/bin/activate`   Activate the environment (Linux/macOS)
#### `venv\Scripts\activate`  # Activate the environment (Windows)
#### `pip install -r requirements.txt`  # Install dependencies

### <ins>Create a DeSo Account:</ins>

Go to [deso website](https://test.deso.org) and create an account.

Complete your profile using [update-profile](https://test.deso.org/update-profile).

### <ins>To Set Up Secure Storage for Sensitive Data run following commands in Backend directory:</ins>

#### `mkdir secure`  # Create a secure directory
#### `cd secure`
#### `echo > key_seed.db`  # Create an empty key_seed.db file

### <ins>Create a .env File in secure/ :</ins>

Create a .env file inside the secure folder with the following content:

#### DESO_SEED_PHRASE_OR_HEX=""  # Paste your DeSo seed phrase here
#### DESO_NODE_URL="https://test.deso.org"
#### TESTNET=True
#### DESO_PASSPHRASE=""
#### DESO_INDEX="0"
#### ENCRYPTION_KEY=""

### <ins>Generate an Encryption Key:</ins>

Use the cryptography library (already installed with requirements.txt) to generate an encryption key:

#### `from cryptography.fernet import Fernet`
#### `key = Fernet.generate_key()`
#### `print(key.decode())`  # Copy and paste this into ENCRYPTION_KEY in .env

### <ins>To start the Backend run following in Backend directory:</ins>

#### `python app.py`

## 2️⃣ Frontend (React + TypeScript)

### <ins>To Install Dependencies run following command in frontend directory:</ins>

#### `npm install`

### <ins>To start the Frontend run following in Frontend directory:</ins>

#### `npm start`

