import { prisma } from "../../lib/prisma";

export class TeamService {
  // টিম তৈরি
  static async createTeam(data: {
    name: string;
    description?: string;
    department?: string;
    leaderId?: string;
  }) {
    return prisma.team.create({
      data: {
        name: data.name,
        description: data.description,
        department: data.department,
        leaderId: data.leaderId,
      },
    });
  }

  // সব টিম দেখা
  static async getAllTeams() {
    return prisma.team.findMany({
      include: {
        leader: { select: { fullName: true, email: true } },
        members: {
          include: { user: { select: { fullName: true, email: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // টিমে মেম্বার যোগ করা
  static async addMember(teamId: string, userId: string, role: string) {
    const existing = await prisma.teamMember.findFirst({
      where: { teamId, userId },
    });
    if (existing) throw new Error("User already in team");

    return prisma.teamMember.create({
      data: { teamId, userId, role: role || "MEMBER" },
    });
  }

  // টিম থেকে মেম্বার সরানো
  static async removeMember(teamId: string, userId: string) {
    return prisma.teamMember.deleteMany({
      where: { teamId, userId },
    });
  }

  // টিম ডিটেইলস
  static async getTeamById(teamId: string) {
    return prisma.team.findUnique({
      where: { id: teamId },
      include: {
        leader: { select: { fullName: true, email: true } },
        members: {
          include: {
            user: {
              select: { id: true, fullName: true, email: true, phone: true },
            },
          },
        },
      },
    });
  }
}
