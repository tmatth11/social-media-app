import { useEffect, useState } from "react";
import { createClient } from "../services/supabase/client";
import { User } from "@supabase/supabase-js";

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const supabase = createClient();

        // Get user who is currently logged in
        const getInitialUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                setUser(user);
            }
            catch (error) {
                console.error("Error fetching user:", error);
            }
            finally {
                setLoading(false);
            }
        };

        getInitialUser();

        // Listen for sign-in/sign-out events
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    return { user, loading, isAuthenticated: !!user };
}