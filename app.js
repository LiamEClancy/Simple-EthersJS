// Imports and creating Express server.
const express = require('express');
const ethers = require('ethers');
const app = express();
const fs = require('fs');
app.use(express.static('static'));
app.set('view engine', 'ejs');

const port = 3000;

// Middleware for enabling async routes with Express.
const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next))
  .catch(next);
};

// Creating the contract.
let abi;
let contractAddress = '0xaAA8B3b988c9Ef358a2af25656C047C1B3622E10';
let provider;
let contract;
let contractRaw;
let contractJSON;
let contractWithSigner;

// Creating wallet.
let privateKey = '49D22255E888A798312FDCB825776ECE77F9CBCC6FE99F5B24DC89323996C48E';
let wallet;

// Initializing the server and contract.
app.listen(port, () => {
	console.log(`Ethersjs test work listening on ${port}!`);
	contractRaw = fs.readFileSync('static/js/PaymentProcessor.json');
	contractJSON = JSON.parse(contractRaw);
	abi = contractJSON.abi;
	provider = new ethers.providers.InfuraProvider('kovan', '0c266300e1a743f19b616a48fc9bcd5f');
	contract = new ethers.Contract(contractAddress, abi, provider);
	wallet = new ethers.Wallet(privateKey, provider);
	contractWithSigner = contract.connect(wallet);
});

// Rendering the dashboard for the user.
app.get('/ethersDashboard', (req, res) => {
	res.render('ethersjsDashboard');
});

// Accessing the smart contract.
app.post('/ethersjsBackend', asyncMiddleware(async (req, res, next) => {
	let tx = await contractWithSigner.addService('testing', 1);
	await tx.wait();
	res.send({ status: 'Completed.' });
}));
