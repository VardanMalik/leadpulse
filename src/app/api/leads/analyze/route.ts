import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateSalesBrief } from "@/lib/openai";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { leadId, companyName, companyUrl } = await req.json();

    if (!leadId && !companyName) {
      return NextResponse.json(
        { error: "Either leadId or companyName is required" },
        { status: 400 }
      );
    }

    if (leadId) {
      const lead = await prisma.lead.findUnique({ where: { id: leadId } });

      if (!lead || lead.userId !== session.user.id) {
        return NextResponse.json({ error: "Lead not found" }, { status: 404 });
      }

      let brief: string;
      try {
        brief = await generateSalesBrief(
          lead.companyName,
          lead.companyUrl || undefined
        );
      } catch {
        return NextResponse.json(
          { error: "AI service unavailable. Please try again." },
          { status: 502 }
        );
      }

      const updatedLead = await prisma.lead.update({
        where: { id: leadId },
        data: { aiBrief: brief },
      });

      return NextResponse.json({ brief, lead: updatedLead });
    }

    let brief: string;
    try {
      brief = await generateSalesBrief(companyName, companyUrl);
    } catch {
      return NextResponse.json(
        { error: "AI service unavailable. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ brief });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
