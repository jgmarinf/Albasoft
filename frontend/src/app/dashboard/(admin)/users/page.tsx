import ListWrapper from "@/components/ListWrapper";
import UserCard from "@/components/UserCard";

const mockUsers = [
  {
    id: 1,
    name: "Usuario 1",
    email: "usuario1@ejemplo.com",
    role: "USER",
    password: "", // Campo temporal para el formulario
  },
  { id: 2, name: "Usuario 2", email: "usuario2@ejemplo.com", role: "ADMIN" },
];

export default async function Projects() {
  return (
    <ListWrapper type="users" role="admin">
      {mockUsers.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </ListWrapper>
  );
}
