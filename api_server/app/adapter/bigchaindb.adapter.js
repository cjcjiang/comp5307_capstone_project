const driver = require('bigchaindb-driver');

const API_PATH = process.env.BLOCKCHAIN_URI;
const conn = new driver.Connection(API_PATH);

const get_key_pair = () => {
    const key_pair = new driver.Ed25519Keypair();
    return key_pair;
};

const create_new_asset = (req, res, asset, metadata, public_key, private_key) => {
    const tx_create_new_asset = driver.Transaction.makeCreateTransaction(
        asset,
        metadata,
        [ driver.Transaction.makeOutput(
            driver.Transaction.makeEd25519Condition(public_key))
        ],
        public_key
    );
    const tx_create_new_asset_signed = driver.Transaction.signTransaction(tx_create_new_asset, private_key);
    conn.postTransaction(tx_create_new_asset_signed)
        .then(() => conn.pollStatusAndFetchTransaction(tx_create_new_asset_signed.id))
        .then(retrieved_transaction => {
            console.log('Transaction', retrieved_transaction.id, 'successfully posted.');
            res.json({
                user_profile: req.user,
                asset: asset,
                transaction_id: retrieved_transaction.id
            });
        });
};

const transfer_asset = (req, res, seller_transaction_id, metadata, buyer_public_key, seller_private_key) => {
    conn.getTransaction(seller_transaction_id)
        .then(seller_transaction => {
            const transfer_transaction = driver.Transaction.makeTransferTransaction(
                // signed transaction to transfer
                seller_transaction,
                // metadata
                metadata,
                // Array of output objects to add to the transaction
                [driver.Transaction.makeOutput(driver.Transaction.makeEd25519Condition(buyer_public_key))],
                // Indices of the outputs in unspent transaction that this transaction fulfills
                0
            );
            const transfer_transaction_signed = driver.Transaction.signTransaction(transfer_transaction, seller_private_key);
            conn.postTransaction(transfer_transaction_signed)
                .then(res => {
                    console.log('Response from BDB server:', res);
                    return conn.pollStatusAndFetchTransaction(res.id);
                })
                .then(retrieved_transaction => {
                    // console.log('Is seller the owner?', retrieved_transaction['outputs'][0]['public_keys'][0] == req.user.publicKey);
                    console.log('Transaction', retrieved_transaction.id, 'successfully posted.');
                    res.json({
                        user_profile: req.user,
                        transaction_id: retrieved_transaction.id
                    });
                })
                .catch(function onError(error) {
                    res.json(error);
                });
        })
        .catch(function onError(error) {
            res.json(error);
        });
};

const transaction_check = (req, res, transaction_id, public_key) => {
    conn.getTransaction(transaction_id)
        .then(transaction => {
            if(transaction['outputs'][0]['public_keys'][0] === public_key){
                res.json({msg:'you are the owner.'});
            }else{
                res.json({msg:'you are not the owner.'});
            }
        })
        .catch(function onError(error) {
            res.json(error);
        });
};

module.exports = {
    get_key_pair,
    create_new_asset,
    transfer_asset,
    transaction_check
};


