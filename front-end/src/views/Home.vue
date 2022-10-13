<template>
  <div class="home">
    <div class="coin">
      <img alt="Vue logo" src="../assets/buffalo.png" width="100px" class="mx-auto my-4">
    </div>

    <button
      v-if="!isConnected"
      type="button"
      class="border border-indigo-500 bg-indigo-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-indigo-600 focus:outline-none focus:shadow-outline"
      @click="login"
    >
      Connect Wallet
    </button>

    <div v-else>
      <div class="grid grid-cols-3 gap-4 w-[780px] mx-auto mt-4">
        <div>Coin: <strong>{{nameToken}}</strong></div>
        <div>Ticker: <strong>{{symbolToken}}</strong></div>
        <div>Total Supply: <strong>{{totalSupply}}</strong></div>
      </div>

      <div class="mt-4">
        Contract address: {{buffContractAddr}}<br>
        Your address: {{account}}<br>
        Your balance: {{balanceOf}} bufc
      </div>

      <div class="bg-green-100 rounded-lg p-4 mb-4 text-sm text-green-700 w-[780px] mt-4 mx-auto" role="alert" v-if="notify">
        <div class="w-full flex items-center justify-between">
          <span v-html="notify"></span>
          <button @click="notify=''" class="-mr-1 bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 h-5 w-5 rounded-full flex justify-center items-center">
            <svg class="h-2 w-2 fill-current items-center" viewBox="0 0 20 20"><path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z"/></svg>
          </button>
        </div>
      </div>
      
      <div v-if="isOwner">
        <div class="mx-auto my-10 flex h-32 w-[780px] flex-col rounded-lg bg-white text-black shadow-md">
          <div class="mt-4">
            <h1 class="mx-11 my-1 font-bold text-[20px] text-gray-600">Transfer token</h1>
          </div>
          <div class="relative flex justify-center space-x-3">
            <span class="absolute inset-y-1 left-12 flex items-center pl-2">
            </span>
            <input v-model="transferValue" class="w-[170px] rounded-lg p-2 hover:outline-blue-400" type="number" placeholder="0.0000 BUFFC" />
            <input v-model="transferTo" class="w-[400px] rounded-lg p-2 hover:outline-blue-400" type="text" placeholder="Address to" />
            <button class="w-32 rounded-lg border bg-blue-700 font-medium text-white hover:bg-blue-800" @click="transfer()">
              {{transferLoading ? 'Transfering...' : 'Transfer'}}
            </button>
          </div>
        </div>

        <div class="mx-auto my-14 flex h-32 w-[780px] flex-col rounded-lg bg-white text-black shadow-md">
          <div class="mt-4">
            <h1 class="mx-11 my-1 font-bold text-[20px] text-gray-600">Mint token</h1>
          </div>
          <div class="relative flex justify-center space-x-3">
            <span class="absolute inset-y-1 left-12 flex items-center pl-2">
            </span>
            <input v-model="mintValue" class="w-[570px] rounded-lg p-2 hover:outline-green-400" type="number" placeholder="0.0000 BUFFC" />
            <button class="w-32 rounded-lg border bg-green-700 font-medium text-white hover:bg-green-800" @click="mint()">
              {{transferLoading ? 'Minting...' : 'Mint'}}
            </button>
          </div>
        </div>

        <div class="mx-auto my-14 flex h-32 w-[780px] flex-col rounded-lg bg-white text-black shadow-md">
          <div class="mt-4">
            <h1 class="mx-11 my-1 font-bold text-[20px] text-gray-600">Burn token</h1>
          </div>
          <div class="relative flex justify-center space-x-3">
            <span class="absolute inset-y-1 left-12 flex items-center pl-2">
            </span>
            <input v-model="burnValue" class="w-[570px] rounded-lg p-2 hover:outline-red-500" type="number" placeholder="0.0000 BUFFC" />
            <button class="w-32 rounded-lg border bg-red-500 font-medium text-white hover:bg-red-800" @click="burn()"> 
              {{transferLoading ? 'Burning...' : 'Burn'}}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getWeb3 from '@/util/getWeb3';
import BuffContract from '@/artifacts/BuffaloCoin';
export default {
  name: 'Home',
  data: () => ({
    isConnected: false,
    account: null,
    buffContractAddr: "0x4d347133644B049f599FFa002c31f917ce5A3CFD",
    totalSupply: 0,
    nameToken: "",
    symbolToken: "",
    balanceOf: 0,
    mintValue: "",
    burnValue: "",
    transferValue: "",
    transferTo: "",
    isOwner: false,
    transferLoading: false,
    mintLoading: false,
    burnLoading: false,
    notify: "",
  }),
  mounted(){
    this.init();
    let self = this
    window.ethereum.on("accountsChanged", () => {
      self.init();
    });
  },

  methods: {
    async init(){
      await this.login();
      this.getOwner();
      this.getTotalSupply();
      this.getNameToken();
      this.getSymbolToken();
      this.getBalanceOf();
    },
    async login(){
      let self = this
      const web3 = await getWeb3();
      await web3.eth.getAccounts().then(function(accounts){
        self.isConnected = true;
        self.account=accounts[0];
      });
    },
    async getTotalSupply(){
      const abi = BuffContract.abi;
      const web3 = await getWeb3();
      const buffContract = new web3.eth.Contract(abi, this.buffContractAddr);
      const _totalSupply = await buffContract.methods.totalSupply().call();
      this.totalSupply = web3.utils.fromWei(_totalSupply, 'ether');
    },
    async getNameToken(){
      const abi = BuffContract.abi;
      const web3 = await getWeb3();
      const buffContract = new web3.eth.Contract(abi, this.buffContractAddr);
      this.nameToken = await buffContract.methods.name().call();
    },
    async getSymbolToken(){
      const abi = BuffContract.abi;
      const web3 = await getWeb3();
      const buffContract = new web3.eth.Contract(abi, this.buffContractAddr);
      this.symbolToken = await buffContract.methods.symbol().call();
    },
    async getBalanceOf(){
      const abi = BuffContract.abi;
      const web3 = await getWeb3();
      const buffContract = new web3.eth.Contract(abi, this.buffContractAddr);
      const _balanceOf = await buffContract.methods.balanceOf(this.account).call();
      this.balanceOf = web3.utils.fromWei(_balanceOf, 'ether');
    },
    async getOwner(){
      const abi = BuffContract.abi;
      const web3 = await getWeb3();
      const buffContract = new web3.eth.Contract(abi, this.buffContractAddr);
      const _owner = await buffContract.methods.owner().call();
      this.isOwner = _owner === this.account ? true : false;
    },
    async transfer(){
      this.transferLoading=true;
      const abi = BuffContract.abi;
      const web3 = await getWeb3();
      const buffContract = new web3.eth.Contract(abi, this.buffContractAddr);
      const _transferValue = web3.utils.toWei(this.transferValue, 'ether');
      const txn = await buffContract.methods.mint(this.transferTo, _transferValue).send({from: this.account});
      this.notify = `Tokens Transfered, txn hash:  
        <a class="font-medium" href="https://rinkeby.etherscan.io/tx/${txn.transactionHash}" target="_blank">
          ${txn.transactionHash}</a>`;
      this.transferTo = "";
      this.transferValue = "";
      this.transferLoading=false;
    },
    async mint(){
      this.mintLoading=true;
      const abi = BuffContract.abi;
      const web3 = await getWeb3();
      const buffContract = new web3.eth.Contract(abi, this.buffContractAddr);
      const _mintValue = web3.utils.toWei(this.mintValue, 'ether');
      const txn = await buffContract.methods.mint(this.account, _mintValue).send({from: this.account});
      this.notify = `Tokens minted, txn hash:  
        <a class="font-medium" href="https://rinkeby.etherscan.io/tx/${txn.transactionHash}" target="_blank">
          ${txn.transactionHash}</a>`;
      this.getTotalSupply();
      this.mintValue = "";
      this.mintLoading=false;
    },
    async burn(){
      this.burnLoading=true;
      const abi = BuffContract.abi;
      const web3 = await getWeb3();
      const buffContract = new web3.eth.Contract(abi, this.buffContractAddr);
      const _burnValue = web3.utils.toWei(this.burnValue, 'ether');
      const txn = await buffContract.methods.burn(_burnValue).send({from: this.account});
      this.notify = `Tokens burned, txn hash:  
        <a class="font-medium" href="https://rinkeby.etherscan.io/tx/${txn.transactionHash}" target="_blank">
          ${txn.transactionHash}</a>`;
      this.getTotalSupply();
      this.burnValue = "";
      this.burnLoading=false;
    },
  }
}
</script>

<style scoped>
  .coin{
    width: 180px;
    height: 180px;
    border: 1px solid;
    border-radius: 50%;
    margin: 15px auto;
  }
</style>