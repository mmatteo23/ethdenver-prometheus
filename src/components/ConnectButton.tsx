import { useConnectWallet } from "@web3-onboard/react";

export default function ConnectButton() {
  const [{ wallet }, connect, disconnect] = useConnectWallet();

  const handleConnect = () => {
    wallet ? disconnect(wallet) : connect();
  };

  const accountData = wallet?.accounts[0];
  const accountAddress = accountData?.ens
    ? accountData.ens?.name
    : `${accountData?.address.slice(0, 5)}...${accountData?.address.slice(-3)}`;

  if (accountData) {
    return (
      <div className="flex flex-row gap-2">
        <div className="flex flex-col px-2 py-1 border rounded-lg text-xs">
          <b className="">{accountAddress}</b>
          <p>
            <span className="hidden sm:inline">Balance: </span>{`${Number(accountData?.balance?.ETH).toFixed(3)} ETH`}
          </p>
        </div>
        <button
          className="btn btn-primary border rounded-lg py-2 px-2 flex flex-row"
          onClick={() => disconnect(wallet)}
        >
          <span className="hidden sm:inline mr-1">Disconnect</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        </button>
      </div>
    );
  }
  return (
    <>
      <button
        className="btn btn-primary border rounded-lg py-2 px-4"
        onClick={handleConnect}
      >
        Connect
      </button>
    </>
  );
}
