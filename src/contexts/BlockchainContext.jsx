import React, { useState, useEffect } from "react";
import { ethers } from 'ethers'

export const BlockchainContext = React.createContext({
  currentAccount: null,
  provider: null
});


const BlockchainContextProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState("")
  const [networkId, setNetworkId] = useState("")


  useEffect(() => {
    const updateCurrentAccounts = accounts => {
      const [_account] = accounts;
      setCurrentAccount(_account);
    }

    window.ethereum.request({ method: 'eth_requestAccounts' }).then(updateCurrentAccounts);

    window.ethereum.on("accountsChanged", updateCurrentAccounts);

    window.ethereum.on("accountsChanged", accounts => {
      console.log(accounts)
    });

    const getNetWorkId = async () => {
      const networkId = await window.ethereum.request({
        method: "net_version",
      });
      setNetworkId(networkId)
      if (networkId && networkId !== "4") {

        window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x4' }] })
          .then(res => alert("Switch chain to Rinkeby has been requested"))
          .catch(err => console.error(err))
      } else {
        const _provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(_provider)
      }
    }
    getNetWorkId()

    window.ethereum.on('chainChanged', (chainId) => {
      setChainId(chainId)
      if (chainId && chainId !== "0x4") {

        window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x4' }] })
          .then(res => alert("Switch chain to Rinkeby has been requested"))
          .catch(err => console.error(err))
      } else {
        const _provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(_provider)
      }
    });
    /*
     * 使用 window.ethereum 來透過 Matamask (狐狸錢包) 來取得錢包地址
     * 並且將錢包地址設定在上方事先寫好的 currentAccount state
     * V 加分項目1: 使用 window.ethereum 偵測換錢包地址事件，並且切換 currentAccount 值
     * V 加分項目2: 使用 window.ethereum 偵測目前的鏈是否為 Rinkeby，如果不是，則透過 window.ethereum 跳出換鏈提示
     * 提示: Rinkeby chain ID 為 0x4
     * 參考資料: https://docs.metamask.io/guide/rpc-api.html
     */
  }, []);

  useEffect(() => {
    /*
     * 使用 ethers.js
     * 透過 Web3Provider 將 window.ethereum 做為參數建立一個新的 web3 provider
     * 並將這個新的 web3 provider 設定成 provider 的 state
     */
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    setProvider(_provider)

  }, [currentAccount]);

  return (
    <BlockchainContext.Provider value={{ currentAccount, provider }}>
      {children}
    </BlockchainContext.Provider>
  );
};

export default BlockchainContextProvider;
