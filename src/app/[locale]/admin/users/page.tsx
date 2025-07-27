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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data, to be replaced with real data from Firestore later
const users = [
    {
        id: "1",
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        avatar: "/avatars/01.png",
        fallback: "OM",
        role: "Pro",
        status: "Active",
        createdAt: "2024-05-15"
    },
    {
        id: "2",
        name: "Jackson Lee",
        email: "jackson.lee@email.com",
        avatar: "/avatars/02.png",
        fallback: "JL",
        role: "Free",
        status: "Active",
        createdAt: "2024-05-14"
    },
     {
        id: "3",
        name: "Isabella Nguyen",
        email: "isabella.nguyen@email.com",
        avatar: "/avatars/03.png",
        fallback: "IN",
        role: "Free",
        status: "Suspended",
        createdAt: "2024-05-13"
    },
     {
        id: "4",
        name: "William Kim",
        email: "will@email.com",
        avatar: "/avatars/04.png",
        fallback: "WK",
        role: "Admin",
        status: "Active",
        createdAt: "2024-05-12"
    },
     {
        id: "5",
        name: "Sofia Davis",
        email: "sofia.davis@email.com",
        avatar: "/avatars/05.png",
        fallback: "SD",
        role: "Free",
        status: "Active",
        createdAt: "2024-05-11"
    }
]

function UserActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-haspopup="true" size="icon" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>View Details</DropdownMenuItem>
        <DropdownMenuItem>Suspend</DropdownMenuItem>
        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function AdminUsersPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage all registered users on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Avatar</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                 <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Created at</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="hidden sm:table-cell">
                     <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatar} alt="Avatar" />
                        <AvatarFallback>{user.fallback}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                   <TableCell>
                    <Badge variant={user.role === 'Admin' ? 'default' : user.role === 'Pro' ? 'secondary' : 'outline' }>{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {user.createdAt}
                  </TableCell>
                  <TableCell>
                    <UserActions />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
