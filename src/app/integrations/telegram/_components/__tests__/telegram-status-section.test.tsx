import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TelegramStatusSection } from "../telegram-status-section";

describe("TelegramStatusSection", () => {
  it("shows waiting state when not connected", () => {
    render(
      <TelegramStatusSection
        token="ABC12345"
        connected={false}
        isLoading={false}
        error={null}
      />,
    );
    expect(screen.getByText("Aguardando conexão")).toBeInTheDocument();
    expect(screen.getByText("ABC12345")).toBeInTheDocument();
  });

  it("shows connected state when chatId exists", () => {
    render(
      <TelegramStatusSection
        token="ABC12345"
        connected={true}
        isLoading={false}
        error={null}
      />,
    );
    expect(screen.getByText("Conectado")).toBeInTheDocument();
    expect(screen.getByText("ABC12345")).toBeInTheDocument();
  });

  it("shows loading state while fetching", () => {
    render(
      <TelegramStatusSection
        token={undefined}
        connected={false}
        isLoading={true}
        error={null}
      />,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows friendly error message without stack trace", () => {
    render(
      <TelegramStatusSection
        token={undefined}
        connected={false}
        isLoading={false}
        error="Não foi possível carregar a integração"
      />,
    );
    expect(
      screen.getByText("Não foi possível carregar a integração"),
    ).toBeInTheDocument();
  });
});
