import { test, expect } from '@playwright/test';

// exposing console erorrs that fail tests
export function consoleErrorsExposure(page) {
  page.on('console', msg => {
    if (msg.type() === 'error') {
      throw new Error(`Console error detected: ${msg.text()}`)
    }
  })
};

// accept dialog with a message
export function acceptDialog(page, dialogMessage) {
  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toBe(dialogMessage);
    await dialog.accept()
  })
};

// cancel dialog with a message
export function cancelDialog(page, dialogMessage) {
  page.once("dialog", async (dialog) => {
    expect(dialog.message()).toBe(dialogMessage);
    await dialog.dismiss()
  })
}
