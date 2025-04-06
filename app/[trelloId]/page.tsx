import TrelloObject from "@/modules/TrelloObject/TrelloObject";

const Page = async ({ params }: { params: Promise<{ trelloId: string }> }) => {
  const { trelloId } = await params;
  return (
    <div>
      <TrelloObject trelloId={parseInt(trelloId)} />
    </div>
  );
};

export default Page;
