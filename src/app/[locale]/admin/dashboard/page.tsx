"use client"

import { Activity, ArrowUpRight, DollarSign, Users, Link as LinkIcon } from "lucide-react"
import { Link } from "@/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const StatCard = ({ title, value, change, icon: Icon }: { title: string, value: string, change: string, icon: React.ElementType }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{change}</p>
    </CardContent>
  </Card>
);

const RecentLinksTable = () => (
  <Card className="xl:col-span-2">
    <CardHeader className="flex flex-row items-center">
      <div className="grid gap-2">
        <CardTitle>Recent Links</CardTitle>
        <CardDescription>
          Recent links created across the platform.
        </CardDescription>
      </div>
      <Button asChild size="sm" className="ml-auto gap-1">
        <Link href="/admin/links">
          View All
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Button>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Original URL</TableHead>
            <TableHead>Short Link</TableHead>
            <TableHead className="text-right">Clicks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Sample Data */}
          <TableRow>
            <TableCell>
              <div className="font-medium">Liam Johnson</div>
              <div className="hidden text-sm text-muted-foreground md:inline">
                liam@example.com
              </div>
            </TableCell>
            <TableCell className="font-medium truncate max-w-xs">
              https://www.example.com/very-long-url-that-is-truncated
            </TableCell>
            <TableCell>linxer.com/abcde</TableCell>
            <TableCell className="text-right">1,204</TableCell>
          </TableRow>
           <TableRow>
              <TableCell>
                <div className="font-medium">Olivia Smith</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  olivia@example.com
                </div>
              </TableCell>
              <TableCell className="font-medium truncate max-w-xs">
                https://www.another-example.com/another/long/url
              </TableCell>
              <TableCell>
                linxer.com/fghij
              </TableCell>
              <TableCell className="text-right">892</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const RecentUsersList = () => (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
        <CardDescription>
          New users who signed up recently.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-8">
        {/* Sample Data */}
        <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>OM</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">
              Olivia Martin
            </p>
            <p className="text-sm text-muted-foreground">
              olivia.martin@email.com
            </p>
          </div>
          <div className="ml-auto font-medium">Free Tier</div>
        </div>
         <div className="flex items-center gap-4">
          <Avatar className="hidden h-9 w-9 sm:flex">
            <AvatarImage src="/avatars/02.png" alt="Avatar" />
            <AvatarFallback>JL</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <p className="text-sm font-medium leading-none">
              Jackson Lee
            </p>
            <p className="text-sm text-muted-foreground">
              jackson.lee@email.com
            </p>
          </div>
          <div className="ml-auto font-medium">Pro</div>
        </div>
      </CardContent>
    </Card>
);


export default function AdminDashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <StatCard title="Total Revenue" value="$45,231.89" change="+20.1% from last month" icon={DollarSign} />
        <StatCard title="Users" value="+2350" change="+180.1% from last month" icon={Users} />
        <StatCard title="Total Links" value="+12,234" change="+19% from last month" icon={LinkIcon} />
        <StatCard title="Total Clicks" value="+573,483" change="+201 since last hour" icon={Activity} />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <RecentLinksTable />
        <RecentUsersList />
      </div>
    </div>
  )
}
