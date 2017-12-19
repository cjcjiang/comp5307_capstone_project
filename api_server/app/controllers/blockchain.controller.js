/**
 * This controller will realize functions related to blockchain system.
 */
const blockchain =require('../adapter/bigchaindb.adapter.js');

/**
 * GET /
 * Show all of the api related to blockchain system.
 */
exports.show_blockchain_api = (req, res) => {
    res.json({msg:'all of blockchain api'});
};

/**
 * GET /create_new_asset
 * Show create_new_asset page.
 */
exports.show_create_new_asset = (req, res) => {
    res.json(req.user);
};

/**
 * POST /create_new_asset
 * Create new asset.
 */
exports.create_new_asset = (req, res) => {
    const producer_check = req.user.producer;
    const public_key = req.user.public_key;
    const private_key = req.user.private_key;
    const asset = req.body.asset;
    const metadata = req.body.metadata;
    if(producer_check==='yes'){
        blockchain.create_new_asset(req, res, asset, metadata, public_key, private_key);
    }else{
        res.json({msg:'You are not allowed to create new asset.'})
    }
};

/**
 * POST /transfer_asset
 * Transfer the asset from the seller to the buyer.
 */
exports.transfer_asset = (req, res) => {
    const seller_private_key = req.user.private_key;
    const buyer_public_key = req.body.buyer_public_key;
    const seller_transaction_id = req.body.seller_transaction_id;
    const metadata = req.body.metadata;
    blockchain.transfer_asset(req, res, seller_transaction_id, metadata, buyer_public_key, seller_private_key);
};

/**
 * POST /transaction_check
 * Check the owner of the transaction.
 */
exports.transaction_check = (req, res) => {
    const transaction_id = req.body.transaction_id;
    const public_key = req.user.public_key;
    blockchain.transaction_check(req, res, transaction_id, public_key);
};
