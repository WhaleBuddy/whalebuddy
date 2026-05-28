import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { TelegramStatusSection } from "../telegram-status-section";

const defaultProps = {
  token: "ABC12345",
  connected: false,
  isLoading: false,
  error: null,
  botUsername: "testbot",
  onSendTestMessage: vi.fn(),
  isSendingTestMessage: false,
  testResult: null as "success" | "error" | null,
};

describe("TelegramStatusSection", () => {
  it("shows waiting state when not connected", () => {
    render(<TelegramStatusSection {...defaultProps} />);
    expect(screen.getByText("Aguardando conexão")).toBeInTheDocument();
    expect(screen.getByText("ABC12345")).toBeInTheDocument();
  });

  it("shows connected state when chatId exists", () => {
    render(<TelegramStatusSection {...defaultProps} connected={true} />);
    expect(screen.getByText("Conectado")).toBeInTheDocument();
    expect(screen.getByText("ABC12345")).toBeInTheDocument();
  });

  it("shows loading state while fetching", () => {
    render(
      <TelegramStatusSection
        {...defaultProps}
        token={undefined}
        isLoading={true}
      />,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows friendly error message without stack trace", () => {
    render(
      <TelegramStatusSection
        {...defaultProps}
        token={undefined}
        error="Não foi possível carregar a integração"
      />,
    );
    expect(
      screen.getByText("Não foi possível carregar a integração"),
    ).toBeInTheDocument();
  });

  describe("copy token", () => {
    beforeEach(() => {
      Object.defineProperty(navigator, "clipboard", {
        value: { writeText: vi.fn().mockResolvedValue(undefined) },
        writable: true,
        configurable: true,
      });
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("copies token to clipboard and shows feedback on click", () => {
      render(<TelegramStatusSection {...defaultProps} />);
      fireEvent.click(screen.getByRole("button", { name: "Copiar token" }));
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith("ABC12345");
      expect(screen.getByRole("tooltip")).toHaveTextContent("Token copiado");
    });

    it("hides copy feedback after 2 seconds", () => {
      render(<TelegramStatusSection {...defaultProps} />);
      fireEvent.click(screen.getByRole("button", { name: "Copiar token" }));
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  describe("open in Telegram", () => {
    it("has link opening the bot URL in a new tab", () => {
      render(<TelegramStatusSection {...defaultProps} />);
      const link = screen.getByRole("link", { name: /Abrir no Telegram/i });
      expect(link).toHaveAttribute("href", "https://t.me/testbot");
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("falls back to generic Telegram URL when botUsername is undefined", () => {
      render(<TelegramStatusSection {...defaultProps} botUsername={undefined} />);
      const link = screen.getByRole("link", { name: /Abrir no Telegram/i });
      expect(link).toHaveAttribute("href", "https://t.me");
    });
  });

  describe("send test message", () => {
    it("hides send test button when not connected", () => {
      render(<TelegramStatusSection {...defaultProps} connected={false} />);
      expect(
        screen.queryByRole("button", { name: /Enviar mensagem de teste/i }),
      ).not.toBeInTheDocument();
    });

    it("shows send test button when connected", () => {
      render(<TelegramStatusSection {...defaultProps} connected={true} />);
      expect(
        screen.getByRole("button", { name: /Enviar mensagem de teste/i }),
      ).toBeInTheDocument();
    });

    it("calls onSendTestMessage when button is clicked", () => {
      const onSendTestMessage = vi.fn();
      render(
        <TelegramStatusSection
          {...defaultProps}
          connected={true}
          onSendTestMessage={onSendTestMessage}
        />,
      );
      fireEvent.click(
        screen.getByRole("button", { name: /Enviar mensagem de teste/i }),
      );
      expect(onSendTestMessage).toHaveBeenCalledOnce();
    });

    it("disables button while sending", () => {
      render(
        <TelegramStatusSection
          {...defaultProps}
          connected={true}
          isSendingTestMessage={true}
        />,
      );
      expect(screen.getByRole("button", { name: /Enviando.../i })).toBeDisabled();
    });

    it("shows success message after successful send", () => {
      render(
        <TelegramStatusSection
          {...defaultProps}
          connected={true}
          testResult="success"
        />,
      );
      expect(
        screen.getByText(/Mensagem enviada com sucesso\. Verifique seu Telegram\./),
      ).toBeInTheDocument();
    });

    it("shows error message after failed send", () => {
      render(
        <TelegramStatusSection
          {...defaultProps}
          connected={true}
          testResult="error"
        />,
      );
      expect(
        screen.getByText(/Não foi possível enviar a mensagem de teste\. Tente novamente\./),
      ).toBeInTheDocument();
    });
  });
});
