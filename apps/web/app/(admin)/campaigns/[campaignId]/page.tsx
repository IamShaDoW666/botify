import { prisma } from "@repo/db";
import { notFound } from "next/navigation";

const CampaignDetailsPage = async ({ params }: { params: { campaignId: string } }) => {
  const campaign = await prisma.campaign.findUnique({
    where: {
      id: params.campaignId,
    },
  });

  if (!campaign) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{campaign.name}</h1>
      <p>Status: {campaign.status}</p>
      <p>Message: {campaign.message}</p>
      <p>Created At: {new Date(campaign.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default CampaignDetailsPage;
