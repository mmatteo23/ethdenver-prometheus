import React from "react";

const CreateAttestation = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      projectName: { value: string };
      owners: { value: string };
      inspirationIds: { value: string };
    };
    const projectName = target.projectName.value;
    const owners = target.owners.value.split(", ");
    const inspirationIds = target.inspirationIds.value.split(", ");

    console.log("Create Attestation", projectName, owners, inspirationIds);
  };
  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-xl font-bold">Create Attestation</h1>
      <form onSubmit={handleSubmit} className="flex flex-col max-w-[90%]">
        <label htmlFor="projectName">Project Name</label>
        <input type="text" name="projectName" placeholder="Project Name" />

        <label htmlFor="owner">Owners</label>
        <input type="text" name="owners" placeholder="owner1, owner2, owner3" />

        <label htmlFor="inspirationIds">Inspiration Attestation Ids</label>
        <input
          name="inspirationIds"
          type="text"
          placeholder="attestationId1, attestationId2, attestationId3"
        />
        <button
          type="submit"
          className="btn btn-primary p-2 bg-slate-300 rounded-lg"
        >
          Create Attestation
        </button>
      </form>
    </div>
  );
};

export default CreateAttestation;
