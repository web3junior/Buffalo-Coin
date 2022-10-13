const BuffaloCoin = artifacts.require("BuffaloCoin");

contract('BuffaloCoin', (accounts) => {
  it('should put 1000 BuffaloCoin in the first account', async () => {
    const buffaloCoinInstance = await BuffaloCoin.deployed();
    const balance = await buffaloCoinInstance.getBalance.call(accounts[0]);

    assert.equal(balance.valueOf(), 1000, "1000 wasn't in the first account");
  });
  it('should send coin correctly', async () => {
    const buffaloCoinInstance = await BuffaloCoin.deployed();

    // Setup 2 accounts.
    const accountOne = accounts[0];
    const accountTwo = accounts[1];

    // Get initial balances of first and second account.
    const accountOneStartingBalance = (await buffaloCoinInstance.getBalance.call(accountOne)).toNumber();
    const accountTwoStartingBalance = (await buffaloCoinInstance.getBalance.call(accountTwo)).toNumber();

    // Make transaction from first account to second.
    const amount = 10;
    await buffaloCoinInstance.sendCoin(accountTwo, amount, { from: accountOne });

    // Get balances of first and second account after the transactions.
    const accountOneEndingBalance = (await metaCoinInstance.getBalance.call(accountOne)).toNumber();
    const accountTwoEndingBalance = (await metaCoinInstance.getBalance.call(accountTwo)).toNumber();

    assert.equal(accountOneEndingBalance, accountOneStartingBalance - amount, "Amount wasn't correctly taken from the sender");
    assert.equal(accountTwoEndingBalance, accountTwoStartingBalance + amount, "Amount wasn't correctly sent to the receiver");
  });
});
