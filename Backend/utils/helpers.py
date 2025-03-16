from deso_sdk import DeSoDexClient

def initialize_deso_client():
    return DeSoDexClient(
        is_testnet=True,
        seed_phrase_or_hex="your_seed_phrase",
        node_url="https://test.deso.org"
    )

def get_user_balance(public_key):
    client = initialize_deso_client()
    return client.get_token_balances(
        user_public_key=public_key,
        creator_public_keys=["DESO"]
    )