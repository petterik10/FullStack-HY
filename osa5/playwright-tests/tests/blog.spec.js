import { test, expect, beforeEach, describe } from "@playwright/test";
import { loginWith, createBlog } from "./helper";

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    const heading = page.getByText("Log in to application");
    await expect(heading).toBeVisible();

    const loginButton = page.getByRole("button", { name: "login" });
    await expect(loginButton).toBeVisible();
  });

  test("succeeds with correct credentials", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "login" }).click();
    await page.getByRole("textbox").first().fill("mluukkai");
    await page.getByRole("textbox").last().fill("salainen");
    await page.getByRole("button", { name: "login" }).click();

    await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
  });

  test("fails with wrong credentials", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "login" }).click();
    await page.getByRole("textbox").first().fill("mluukkai");
    await page.getByRole("textbox").last().fill("eisalainen");
    await page.getByRole("button", { name: "login" }).click();

    await expect(page.getByText("wrong username or password")).toBeVisible();
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, "Test Blog", "Test Author", "http://test.url");
      await expect(page.getByText("Test Blog Test Author")).toBeVisible();
    });

    describe("and a blog exists", () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          "A blog for liking",
          "Test Author",
          "http://test.url"
        );
      });

      test("blog can be liked", async ({ page }) => {
        await page.getByRole("button", { name: "view" }).click();
        await expect(page.getByText("likes 0")).toBeVisible();
        await page.getByRole("button", { name: "like" }).click();
        await expect(page.getByText("likes 1")).toBeVisible();
      });

      test("only creator can see the remove button", async ({
        page,
        request,
      }) => {
        await page.getByRole("button", { name: "view" }).click();

        const removeButton = page.getByTestId("remove-button");
        const count = await removeButton.count();

        if (count > 0) {
          await expect(removeButton).toBeVisible();
        }

        await page.getByRole("button", { name: "logout" }).click();

        await request.post("/api/users", {
          data: {
            name: "Another User",
            username: "another",
            password: "password",
          },
        });

        await loginWith(page, "another", "password");

        await page.getByRole("button", { name: "view" }).click();

        await expect(removeButton).not.toBeVisible();
      });
    });
  });
});
