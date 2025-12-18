import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail, generateEmailTemplates } from "@/lib/email";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { requestId: id },
      include: {
        customer: true,
        provider: true,
      },
    });

    if (!serviceRequest) {
      return NextResponse.json(
        { error: "Service request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(serviceRequest);
  } catch (error: any) {
    console.error("Get service request error:", error);
    return NextResponse.json(
      { error: "Failed to fetch service request" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    const updateableFields = [
      "status",
      "priority",
      "assignedProviderId",
      "providerName",
      "providerPhone",
      "providerEmail",
      "paymentMethod",
      "proofOfPaymentUrl",
      "customerPaymentReceived",
      "providerPaymentMade",
      "commissionCollected",
      "adminNotes",
    ];

    const updateData: any = {};

    // Prisma automatically maps camelCase to snake_case via @map directives
    // So we use the Prisma model field names (camelCase)
    for (const field of updateableFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }

    // If assignedProviderId is set, fetch and update provider details
    if (
      data.assignedProviderId !== undefined &&
      data.assignedProviderId !== null &&
      data.assignedProviderId !== ""
    ) {
      const providerId = parseInt(data.assignedProviderId.toString());
      const provider = await prisma.serviceProvider.findUnique({
        where: { id: providerId },
      });
      if (provider) {
        updateData.providerName = provider.name;
        updateData.providerPhone = provider.phone;
        updateData.providerEmail = provider.email;
      }
    }

    // Get current service request to compare status
    const currentRequest = await prisma.serviceRequest.findUnique({
      where: { requestId: id },
    });

    if (!currentRequest) {
      return NextResponse.json(
        { error: "Service request not found" },
        { status: 404 }
      );
    }

    const oldStatus = currentRequest.status;
    const newStatus = data.status;

    // Handle status changes and send appropriate emails
    if (newStatus && newStatus !== oldStatus) {
      // Set timestamps for specific statuses
      if (newStatus === "confirmed" && !updateData.confirmedAt) {
        updateData.confirmedAt = new Date();
      }
      if (newStatus === "completed" && !updateData.completedAt) {
        updateData.completedAt = new Date();
      }

      const templates = generateEmailTemplates();

      // Handle confirmed status with provider assignment
      if (newStatus === "confirmed") {
        const providerId =
          data.assignedProviderId !== undefined &&
          data.assignedProviderId !== null &&
          data.assignedProviderId !== ""
            ? parseInt(data.assignedProviderId.toString())
            : currentRequest?.assignedProviderId;

        if (providerId) {
          const provider = await prisma.serviceProvider.findUnique({
            where: { id: providerId },
          });
          if (provider) {
            // Send provider assignment email
            const providerEmail = templates.providerAssignment({
              providerName: provider.name,
              requestId: id,
              customerName: currentRequest.customerName,
              customerAddress: currentRequest.customerAddress,
              preferredDate: currentRequest.preferredDate
                .toISOString()
                .split("T")[0],
              preferredTime: currentRequest.preferredTime,
            });
            await sendEmail({
              to: provider.email,
              subject: providerEmail.subject,
              html: providerEmail.html,
            });

            // Send customer notification with provider details
            const customerEmail = templates.customerProviderDetails({
              customerName: currentRequest.customerName,
              providerName: provider.name,
              providerPhone: provider.phone,
              providerEmail: provider.email,
              requestId: id,
            });
            await sendEmail({
              to: currentRequest.customerEmail,
              subject: customerEmail.subject,
              html: customerEmail.html,
            });
          }
        } else {
          // No provider assigned yet, send general status update
          const statusEmail = templates.statusUpdate({
            customerName: currentRequest.customerName,
            requestId: id,
            oldStatus,
            newStatus,
            preferredDate: currentRequest.preferredDate
              .toISOString()
              .split("T")[0],
            preferredTime: currentRequest.preferredTime,
          });
          await sendEmail({
            to: currentRequest.customerEmail,
            subject: statusEmail.subject,
            html: statusEmail.html,
          });
        }
      } else if (newStatus === "completed") {
        // Send completion email
        const completionEmail = templates.serviceCompletion({
          customerName: currentRequest.customerName,
          requestId: id,
        });
        await sendEmail({
          to: currentRequest.customerEmail,
          subject: completionEmail.subject,
          html: completionEmail.html,
        });
      } else {
        // Send status update email for all other status changes
        const provider = currentRequest.assignedProviderId
          ? await prisma.serviceProvider.findUnique({
              where: { id: currentRequest.assignedProviderId },
            })
          : null;

        const statusEmail = templates.statusUpdate({
          customerName: currentRequest.customerName,
          requestId: id,
          oldStatus,
          newStatus,
          providerName: provider?.name,
          providerPhone: provider?.phone,
          providerEmail: provider?.email,
          preferredDate: currentRequest.preferredDate
            .toISOString()
            .split("T")[0],
          preferredTime: currentRequest.preferredTime,
        });
        await sendEmail({
          to: currentRequest.customerEmail,
          subject: statusEmail.subject,
          html: statusEmail.html,
        });
      }
    }

    const updated = await prisma.serviceRequest.update({
      where: { requestId: id },
      data: updateData,
      include: {
        customer: true,
        provider: true,
      },
    });

    return NextResponse.json({
      message: "Service request updated",
      request: updated,
    });
  } catch (error: any) {
    console.error("Update service request error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
    return NextResponse.json(
      {
        error: error.message || "Failed to update service request",
        details: error.meta,
      },
      { status: 500 }
    );
  }
}
