import { Attestation } from "@verax-attestation-registry/verax-sdk";

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

const GetProjects = ({
  filterByUser = false,
  attestations,
}: {
  filterByUser: boolean;
  attestations: Attestation[];
}) => {
  const lessUsername = (username: string) => {
    if (username.length < 10 || !username) {
      return username;
    } else return `${username.slice(0, 6)}...${username.slice(-4)}`;
  };

  return (
    <>
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
