interface AdminAccount {
  id: string;
  password: string;
}

const ADMIN_ACCOUNTS: AdminAccount[] = [
  { id: "admin0", password: "canoejang" },
  { id: "admin1", password: "canoejang" },
  { id: "admin2", password: "canoejang" },
  { id: "admin3", password: "canoejang" },
];

export function validateLogin(id: string, password: string): boolean {
  return ADMIN_ACCOUNTS.some((a) => a.id === id && a.password === password);
}
