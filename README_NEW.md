# 🔧 Setup

## 1️⃣ Backend (Python + Flask)

### <ins>To Create Python Environment and Install Dependencies run following commands in project directory:</ins>

#### `python -m venv venv`  # Create a virtual environment
#### `source venv/bin/activate`   Activate the environment (Linux/macOS)
#### `venv\Scripts\activate`  # Activate the environment (Windows)
#### `pip install -r requirements.txt`  # Install dependencies

### Create a DeSo Account:

Go to [deso website](https://test.deso.org) and create an account.

Complete your profile using [update-profile](https://test.deso.org/update-profile).

### To Set Up Secure Storage for Sensitive Data run following commands in Backend directory:

#### `mkdir secure`  # Create a secure directory
#### `cd secure`
#### `echo > key_seed.db`  # Create an empty key_seed.db file

### Create a .env File in secure/ :

Create a .env file inside the secure folder with the following content:

#### DESO_SEED_PHRASE_OR_HEX=""  # Paste your DeSo seed phrase here
#### DESO_NODE_URL="https://test.deso.org"
#### TESTNET=True
#### DESO_PASSPHRASE=""
#### DESO_INDEX="0"
#### ENCRYPTION_KEY=""

### Generate an Encryption Key: 

Use the cryptography library (already installed with requirements.txt) to generate an encryption key:

#### `from cryptography.fernet import Fernet`
#### `key = Fernet.generate_key()`
#### `print(key.decode())`  # Copy and paste this into ENCRYPTION_KEY in .env

## 2️⃣ Frontend (React + TypeScript)

### To Install Dependencies run following command in frontend directory:

#### `npm install`

