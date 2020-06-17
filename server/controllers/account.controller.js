import httpStatus from 'http-status';
import db from '../../config/sequelize';

const Account = db.Account;

/**
 * Load account and append to req.
 */
function load(req, res, next, id) {
    Account.findById(id)
        .then((account) => {
            if (!account) {
                const e = new Error('Account does not exist');
                e.status = httpStatus.NOT_FOUND;
                return next(e);
            }
            req.account = account; // eslint-disable-line no-param-reassign
            return next();
        })
        .catch(e => next(e));
}

/**
 * Get account
 * @returns {Account}
 */
function get(req, res) {
    return res.json(req.account);
}

/**
 * Create new account
 * @returns {Account}
 */
function create(req, res, next) {
    const account = Account.build({
        balance: req.body.balance,
    });

    account.save()
        .then(savedAccount => res.json(savedAccount))
        .catch(e => next(e));
}


export default { load, get, create };