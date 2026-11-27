import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  input: {
    home: resolve(import.meta.dirname, "src/pages/index.html"),
    scholarshipDetail: resolve(import.meta.dirname, "src/pages/scholarship/detail.html"),
    reviewList: resolve(import.meta.dirname, "src/pages/review/list.html"),
    reviewDetail: resolve(import.meta.dirname, "src/pages/review/detail.html"),
    reviewWrite: resolve(import.meta.dirname, "src/pages/review/write.html"),
    calendar: resolve(import.meta.dirname, "src/pages/calendar/calendar.html"),
    login: resolve(import.meta.dirname, "src/pages/auth/login.html"),
    register: resolve(import.meta.dirname, "src/pages/auth/register.html"),
    registerSuccess: resolve(import.meta.dirname, "src/pages/auth/register-success.html"),
    error: resolve(import.meta.dirname, "src/pages/error/error.html"),
  },
});
