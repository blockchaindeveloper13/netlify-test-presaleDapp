import React, { useState, useEffect } from "react";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { SiBinance } from "react-icons/si";
import WalletConnectButton from "./components/WalletConnectButton";
import BuyTokensForm from "./components/BuyTokensForm";
import "./App.css";
import tokenomicsImage from "./tokenomics.webp";
import whitepaperPdf from "./Solium_Whitepaper.pdf";
import CountdownTimer from "./components/CountdownTimer";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [contractInfo, setContractInfo] = useState({ totalBNB: 0, remainingTokens: 0 });
  const [showDisclaimer, setShowDisclaimer] = useState(() => {
    return localStorage.getItem("disclaimerAccepted") ? false : true;
  });
  const [serverTime, setServerTime] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      if (provider) {
        try {
          const info = await getContractInfo(provider);
          setContractInfo(info);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchInfo();
  }, [provider]);


  const handleDisclaimerAccept = () => {
    setShowDisclaimer(false);
    localStorage.setItem("disclaimerAccepted", "true");
  };

  return (
    <div className="App">
      <div className="crypto-animations">
        <FaBitcoin className="crypto-float bitcoin" style={{ top: '10%', left: '5%', fontSize: '4rem' }} />
        <FaEthereum className="crypto-float ethereum" style={{ top: '30%', right: '7%', fontSize: '3.5rem' }} />
        <SiBinance className="crypto-float bnb" style={{ bottom: '20%', left: '15%', fontSize: '4.2rem' }} />
      </div>
      {showDisclaimer && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "#000000cc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "30px",
              maxWidth: "600px",
              borderRadius: "10px",
              textAlign: "center",
              boxShadow: "0 0 20px rgba(0,0,0,0.3)",
            }}
          >
            <h2>⚠️ Legal Notice</h2>
            <p style={{ fontSize: "16px", marginBottom: "25px" }}>
              Participation in the Solium Coin presale is <strong>not permitted</strong> for residents of the United States, Canada, or any country subject to international sanctions (including Iran, Cuba, North Korea, Syria, Venezuela, and others).
              <br />
              <br />
              By continuing, you confirm that you are not a resident of a restricted jurisdiction and that you comply with your local laws.
            </p>
            <button
              onClick={handleDisclaimerAccept}
              style={{
                padding: "10px 30px",
                backgroundColor: "#1a73e8",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              I Acknowledge & Continue
            </button>
          </div>
        </div>
      )}

      <header className="App-header">
        <h1>Solium Coin Presale and Airdrop</h1>
      </header>

      <main className="App-main">
        <section className="countdown">
          <CountdownTimer />
        </section>
        <section className="server-info">
          <h2>Server Info</h2>
          {serverTime ? (
            <p>Server Time: {new Date(serverTime).toLocaleString()}</p>
          ) : (
            <p>Server Time Loading...</p>
          )}
        </section>
        <section className="wallet-section">
        <h2>Wallet Connect</h2>
        <WalletConnectButton setProvider={setProvider} setAccount={setAccount} />
      </section>
      <section className="buy-tokens-section">
        <h2>Solium Buy</h2>
        <BuyTokensForm provider={provider} account={account} />
      </section>
        <section className="contract-info-section">
          <h2>Presale Info</h2>
          <div className="info-card">
            <p>
              <strong>Total BNB:</strong> {contractInfo.totalBNB} BNB
            </p>
            <p>
              <strong>Remaining Token:</strong> {contractInfo.remainingTokens}
            </p>
          </div>
        </section>
        <section className="site-info">
          <h1>Welcome to Solium – The People's Coin</h1>
          <p>Solium (SLM) isn't just a token. It's a revolution born from transparency, fairness, and the spirit of Web3.</p>
          <p>
            In a world dominated by VC-funded whales and centralized control, <strong>Solium puts the power back in your hands</strong>.
          </p>
          <h2>Fair. Decentralized. Unstoppable.</h2>
          <ul>
            <li>
              <strong>Total Supply:</strong> 100,000,000 SLM
            </li>
            <li>
              <strong>Presale:</strong> 50,000,000 SLM available now
            </li>
            <li>
              <strong>BSC Contract Address:</strong>{" "}
              <span className="contract-address">0x307a0dc0814CbD64E81a9BC8517441Ca657fB9c7</span>
            </li>
            <li>
              <strong>Solana Contract Address:</strong>{" "}
              <span className="contract-address">9rFLChxL7444pp1ykat7eoaFh76BiLEZNXUvn9Fpump</span>
            </li>
            <li>
              <strong>No Team Allocation – No Dev Fees – No Private Sale</strong>
            </li>
            <li>
              <strong>Every token is earned, not given.</strong>
            </li>
          </ul>
          <h2>Why Solium?</h2>
          <ul>
            <li>
              <strong>100% Public Launch:</strong> No hidden wallets, no early access.
            </li>
            <li>
              <strong>Verified Smart Contracts:</strong> Audited & transparent.
            </li>
            <li>
              <strong>BNB Chain Powered:</strong> Fast, cheap, and secure.
            </li>
            <li>
              <strong>Airdrop, Staking & Gaming:</strong> Built to reward our true believers.
            </li>
            <li>
              <strong>Web3 Ready:</strong> Multi-wallet integration, DEX-compatible.
            </li>
          </ul>
          <h2>Solium Coin Roadmap</h2>
          <h3>Q1: Launch & Presale</h3>
          <ul>
            <li>
              Token creation and smart contract deployment <strong>(Completed)</strong>
            </li>
            <li>
              Website & presale launch <strong>(Completed)</strong>
            </li>
            <li>
              GitHub, Medium, X (Twitter), Telegram setup <strong>(Completed)</strong>
            </li>
            <li>Initial marketing & community building</li>
            <li>First influencer collaborations</li>
            <li>
              Apply for X verification <strong>(Completed)</strong>
            </li>
          </ul>
          <h3>Q2: Growth & Visibility</h3>
          <ul>
            <li>DEXTools, CoinGecko, CoinMarketCap listings</li>
            <li>
              First CEX listing <strong>(Goal: MEXC or Bitget)</strong>
            </li>
            <li>
              Airdrop distribution <strong>(10M SLM)</strong>
            </li>
            <li>Community engagement campaigns</li>
            <li>Dapp integration for staking</li>
            <li>Second round of targeted advertising</li>
          </ul>
          <h3>Q3: Expansion</h3>
          <ul>
            <li>
              Staking launch <strong>(10M SLM allocated)</strong>
            </li>
            <li>Partnership announcements</li>
            <li>
              Listings on top-tier CEXes <strong>(KuCoin, Binance target)</strong>
            </li>
            <li>Solium GameFi concept reveal & development start</li>
            <li>DAO exploration for community governance</li>
            <li>Cross-chain bridge research</li>
          </ul>
          <h3>Q4: Ecosystem Development</h3>
          <ul>
            <li>Full GameFi launch with SLM utility</li>
            <li>Global marketing campaigns</li>
            <li>Real-world integrations</li>
            <li>Long-term staking pools</li>
            <li>NFT collection launch with utility</li>
            <li>Continuous community expansion</li>
          </ul>
          <h2>Solium Tokenomics</h2>
          <img src={tokenomicsImage} alt="Tokenomics" className="tokenomics-image" />
          <div className="whitepaper-section">
            <h2>Solium Whitepaper</h2>
            <p>Download our whitepaper in PDF format:</p>
            <a href={whitepaperPdf} target="_blank" rel="noopener noreferrer">
              Whitepaper (PDF)
            </a>
          </div>
          <h2>Connect with Us</h2>
          <ul className="social-links">
            <li>
              <i className="fas fa-globe"></i>
              <a href="mailto:soliumcoin@gmail.com" target="_blank" rel="noopener noreferrer">
                E-mail: soliumcoin@gmail.com
              </a>
            </li>
            <li>
              <i className="fab fa-telegram"></i>
              <a href="https://t.me/soliumcoin" target="_blank" rel="noopener noreferrer">
                Telegram Channel
              </a>
            </li>
            <li>
              <i className="fab fa-telegram"></i>
              <a href="https://t.me/soliumcoinchat" target="_blank" rel="noopener noreferrer">
                Telegram Group
              </a>
            </li>
            <li>
              <i className="fab fa-x-twitter"></i>
              <a href="https://x.com/soliumcoin" target="_blank" rel="noopener noreferrer">
                X Account
              </a>
            </li>
            <li>
              <i className="fab fa-github"></i>
              <a href="https://github.com/soliumcoin/solium-project" target="_blank" rel="noopener noreferrer">
                GitHub Account
              </a>
            </li>
            <li>
              <i className="fab fa-medium"></i>
              <a href="https://medium.com/@soliumcoin" target="_blank" rel="noopener noreferrer">
                Medium Account
              </a>
            </li>
          </ul>
        </section>
        <section>
          <strong>Disclaimer:</strong> Participation in the Solium Coin presale is not permitted for residents of the United States, Canada, or any country subject to international sanctions (including Iran, Cuba, North Korea, Syria, Venezuela, and others). By using this website, you confirm that you are not located in or a resident of any restricted jurisdiction.
        </section>
      </main>
    </div>
  );
}

export default App;