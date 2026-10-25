import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserRound } from "lucide-react";
import SectionHeading from "./SectionHeading";

export default function ProfileSection({
  user,
  fullName,
  setFullName,
  username,
}) {
  return (
    <Card
      id="profile"
      className="scroll-mt-6 rounded-2xl border-border/70 shadow-sm"
    >
      <CardHeader>
        <SectionHeading
          icon={UserRound}
          title="Profile information"
          description="Manage the personal details associated with your account."
        />
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar className="size-16">
            <AvatarImage src={user?.photoURL ?? ""} />
            <AvatarFallback className="bg-primary text-xl text-primary-foreground">
              {(fullName || user?.email || "K").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <p className="text-sm font-medium">Profile photo</p>
            <p className="text-sm text-muted-foreground">
              Your account avatar is managed by your sign-in provider.
            </p>
          </div>
        </div>

        <Separator />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>

            <Input
              id="fullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Enter your full name"
              maxLength={100}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>

            <Input
              id="username"
              value={username}
              placeholder="Your username"
              disabled
              className="rounded-xl"
            />

            <p className="text-xs text-muted-foreground">
              Username editing is not enabled in this version.
            </p>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="email">Email address</Label>

            <Input
              id="email"
              value={user?.email ?? ""}
              readOnly
              className="rounded-xl bg-muted/40"
            />

            <p className="text-xs text-muted-foreground">
              Email changes should be handled through Firebase authentication
              and account verification.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
