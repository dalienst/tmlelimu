import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface Session {
        user?: {
            id?: string;
            email?: string | null;
            first_name?: string | null;
            last_name?: string | null;
            role?: string | null;
            is_hr?: boolean;
            is_employee?: boolean;
            is_manager?: boolean;
            is_trainer?: boolean;
            is_hod?: boolean;
            is_superuser?: boolean;
            username?: string | null;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        first_name?: string | null;
        last_name?: string | null;
        role?: string | null;
        is_hr?: boolean;
        is_employee?: boolean;
        is_manager?: boolean;
        is_trainer?: boolean;
        is_hod?: boolean;
        is_superuser?: boolean;
        username?: string | null;
    }
}
