import { useConnectWallet } from "@web3-onboard/react";
import { useEffect, useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import { getAttestations } from "../utils/verax";
import { Attestation, VeraxSdk } from "@verax-attestation-registry/verax-sdk";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const GetProjects = ({ filterByUser = false }: { filterByUser: boolean }) => {
  const [error, setError] = useState<string>("");
  const [veraxSdk, setVeraxSdk] = useState<VeraxSdk>();
  const [{ wallet }] = useConnectWallet();
  //  const { chain } = useNetwork();

  const { chainId } = useSDK();
  const [attestations, setAttestations] = useState<Attestation[]>([]);

  const accountData = wallet?.accounts[0];

  console.log("VERAX SDK", veraxSdk);
  console.log("chain", chainId);
  console.log("account ", accountData?.address);

  useEffect(() => {
    const sdk = new VeraxSdk(
      VeraxSdk.DEFAULT_LINEA_TESTNET_FRONTEND,
      accountData?.address as `0x${string}`
    );
    setVeraxSdk(sdk);
  }, [chainId]);

  useEffect(() => {
    if (veraxSdk && accountData?.address) {
      try {
        // get attestations
        getAttestations(
          veraxSdk,
          false,
          filterByUser ? accountData.address : undefined
        ).then((res) => {
          setAttestations(res);
          console.log("Attestations", JSON.parse(JSON.stringify(res)));
        });
      } catch (e) {
        setError(e.message);
      }
    } else {
      console.log("No verax sdk or account");
      // setAttestations(JSON.parse(JSON.stringify(attestationsData)));
    }
  }, [veraxSdk, accountData?.address, filterByUser]);

  const lessUsername = (username: string) => {
    if (username.length < 10 || !username) {
      return username;
    } else return `${username.slice(0, 6)}...${username.slice(-4)}`;
  };

  return (
    <>
      {error && <div className="text-red-500">{error}</div>}
      <Table>
        <TableCaption>
          A list of {filterByUser ? "your" : "all"} attestations
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Attestation Id</TableHead>
            <TableHead>Project Name</TableHead>
            <TableHead>Team Name</TableHead>
            <TableHead>Owners</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attestations?.length > 0
            ? attestations.map((attestation, i) => (
                <TableRow key={i}>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(attestation.id);
                    }}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {lessUsername(attestation.id)}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Click to copy to clipboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    {attestation
                      ? JSON.parse(
                          JSON.stringify(
                            attestation.decodedPayload[0]?.projectName
                          )
                        )
                      : ""}
                  </TableCell>
                  <TableCell>
                    {attestation
                      ? JSON.parse(
                          JSON.stringify(attestation.decodedPayload[0].teamName)
                        )
                      : ""}
                  </TableCell>
                  <TableCell>
                    {attestation.decodedPayload[0].owners
                      .map((o) => lessUsername(o))
                      .join(", ")}
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </>
  );
};

export default GetProjects;
