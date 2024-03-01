import { useConnectWallet } from "@web3-onboard/react";

export default function ConnectButton() {
  const [{ wallet }, connect, disconnect] = useConnectWallet();

  const handleConnect = () => {
    wallet ? disconnect(wallet) : connect();
  };

  const accountData = wallet?.accounts[0];
  const accountAddress = accountData?.ens
    ? accountData.ens?.name
    : `${accountData?.address.slice(0, 6)}...${accountData?.address.slice(-4)}`;

  if (accountData) {
    return (
      <div className="flex flex-row">
        <div className="flex flex-col px-2 py-1 border rounded-lg text-xs">
          <b className="">{accountAddress}</b>
          <p>
            Balance: {`${Number(accountData?.balance?.ETH).toFixed(3)} ETH`}
          </p>
        </div>
        <button
          className="btn btn-primary border rounded-lg py-2 px-2"
          onClick={() => disconnect(wallet)}
        >
          Disconnect
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
