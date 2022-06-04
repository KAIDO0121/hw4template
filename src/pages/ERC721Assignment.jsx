import { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import Layout from "../components/Layout";
import { BlockchainContext } from "../contexts/BlockchainContext";

const CONTRACT_ADDRESS = "0x388256be6bdce27de101d592859a7205e58d0074";
const CONTRACT_ABI = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, {
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
  { "indexed": true, "internalType": "address", "name": "approved", "type": "address" },
  { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "Approval", "type": "event"
}, {
  "anonymous": false, "inputs":
    [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" },
    { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event"
}, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" },

{
  "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
  "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view", "type": "function"
},

{ "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getApproved", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" },

{ "inputs": [], "name": "mint", "outputs": [], "stateMutability": "payable", "type": "function" },
{
  "inputs": [], "name": "mintPrice", "outputs": [
    { "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view", "type": "function"
}, {
  "inputs": [], "name": "name", "outputs":
    [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function"
}, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
{
  "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }],
  "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function"
}, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
{
  "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }],
  "name": "tokenByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view", "type": "function"
}, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenOfOwnerByIndex", "outputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
{
  "inputs": [], "name": "totalSupply", "outputs": [
    { "internalType": "uint256", "name": "", "type": "uint256" }],
  "stateMutability": "view", "type": "function"
}, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];

const ERC721Assignment = () => {
  const { currentAccount, provider, networkId, chainId } = useContext(BlockchainContext);
  const [contract, setContract] = useState();
  useEffect(() => {
    if (provider) {
      const signer = provider.getSigner();
      provider.getBlock().then(block => {
        const _contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider, {
          gasLimit: block.gasLimit
        });
        setContract(_contract.connect(signer));
      })
    }
  }, [provider]);

  const [totalSupply, setTotalSupply] = useState();
  const [mintPrice, setPrice] = useState();
  const [accountBalance, setAccountBalance] = useState();
  useEffect(() => {

    /*
     * 請在此處判斷:
     * 當 contract state 有物件之後，透過 contract state，跟智能合約取得 totalSupply 的值
     * 並且儲存上方的 totalSupply state 中
     * 如果寫成功，則 <div>目前 Mint 數量: {totalSupply}</div> 處就會顯示 totalSupply 的數值
     * 提示: 透過 ethers.js 取得的 counter 數值為 bigNumber，請想辦法轉換成數字或是字串
     */

    const getContractData = async () => {
      try {
        const totalSupply = await contract.totalSupply()
        const mintPrice = await contract.mintPrice()

        const balance = await contract.balanceOf(currentAccount)
        setTotalSupply(totalSupply.toString())
        setPrice(ethers.utils.formatEther(mintPrice))
        setAccountBalance(balance.toNumber())
      } catch (error) {
        console.error(error)
      }

    }

    if (contract) {
      getContractData()
    }
  }, [contract]);



  const onMint = async () => {
    if (mintPrice !== undefined) {
      try {
        const res = await contract.mint({
          value: ethers.utils.parseEther(mintPrice)
        })
      } catch (error) {
        console.error(error)
      }
    }

  };

  useEffect(() => {

    if (!contract) return
    let interval = window.setInterval(() => {
      contract.balanceOf(currentAccount).then(res => {
        setAccountBalance(res.toNumber())
      })

    }, 1000)

    return () => {
      clearInterval(interval)
    }

  }, [contract]);

  return (
    <Layout>
      <h1>進階作業: NFT</h1>

      <div>
        <div>鏈上資料:</div>
        <div className="my-3">
          <div className="mb-1">我的錢包地址: {currentAccount}</div>
          <div className="mb-1">目前總 Mint 數量: {totalSupply}</div>
          <div className="mb-1">我的錢包有的數量: {accountBalance}</div>
          <div className="mb-1">Mint 價格: {mintPrice} ETH</div>
          <button onClick={onMint}>Mint</button>
        </div>

        <div>
          <div>持有者列表:</div>
          <ul>
            {totalSupply && contract ?
              [...new Array(+totalSupply)].map((el, i) => <OwnerListItem
                key={i}
                tokenId={i}
                contract={contract} />) : ""
            }
            {/* 
                請在這裡透過 [...new Array(totalSupply)]，
                來透過 map 迭代，
                顯示 OwnerListItem Component，
                並藉由 map 中的 index 參數，
                將 index 帶入 OwnerListItem Component 的 tokenId 參數以及 contract 物件
                由於是 map 列表，請帶入 key
                注意: 由於 totalSupply 可能為 undefined，請善用 JSX 中的 condition (if / else)
                參考資料1: https://stackoverflow.com/questions/47287177/how-to-loop-over-a-number-in-react-inside-jsx
                參考資料2: https://zh-hant.reactjs.org/docs/lists-and-keys.html
             */}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

const OwnerListItem = ({ tokenId = "", contract }) => {
  const [ownerAddress, setOwnerAddress] = useState("");
  useEffect(() => {
    if (contract && tokenId !== undefined) {
      const getOwner = async () => {
        try {
          const addr = await contract.ownerOf(
            tokenId
          )
          setOwnerAddress(addr)
        } catch (error) {
          console.error(error)
        }
      }
      getOwner()
    }
    /*
     * 請在此處判斷:
     * 透過 contract 參數，跟智能合約取得 ownerOf 的值
     * 並且帶入 tokenId 作為參數
     * 並且儲存上方的 ownerAddress state 中
     * 如果寫成功，則 {ownerAddress} 處就會顯示 ownerAddress 的數值
     */
  }, [contract, tokenId]);

  return (
    <li>
      Token {tokenId} 擁有者 {ownerAddress}
    </li>
  );
};

export default ERC721Assignment;
