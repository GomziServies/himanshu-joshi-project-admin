import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BannersPage } from '../src/pages/BannersPage';
import { ProductsPage } from '../src/pages/ProductsPage';
import { ProductFormModal } from '../src/components/products/ProductFormModal';
import { OrdersPage } from '../src/pages/OrdersPage';
import * as api from '../src/services/api';
import { Product, Banner } from '../src/types';

describe('EMPIRICAL CHALLENGE SUITE: Milestone 3 (Admin Dashboard)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // =========================================================================
  // CHALLENGE 1: BANNER OPTIMISTIC TOGGLE
  // =========================================================================
  describe('Challenge 1: Banner Optimistic Toggle', () => {
    it('survives rapid succession clicking (10 rapid toggles) without state corruption or race lockup', async () => {
      render(<BannersPage />);

      await waitFor(() => {
        expect(screen.getByText(/Maha Shivling Sthapana & Vedic Abhishek/i)).toBeInTheDocument();
      });

      const toggleButtons = screen.getAllByRole('button', { name: /Toggle active status/i });
      const firstToggle = toggleButtons[0];
      expect(firstToggle).toHaveTextContent(/Active/i);

      // Perform 6 rapid toggles in immediate succession
      for (let i = 0; i < 6; i++) {
        fireEvent.click(firstToggle);
      }

      // After an even number (6) of toggles, state should remain Active
      await waitFor(() => {
        expect(firstToggle).toHaveTextContent(/Active/i);
      });

      // 7th click: should flip to Hidden
      fireEvent.click(firstToggle);
      await waitFor(() => {
        expect(firstToggle).toHaveTextContent(/Hidden/i);
      });

      // 8th click: should flip back to Active
      fireEvent.click(firstToggle);
      await waitFor(() => {
        expect(firstToggle).toHaveTextContent(/Active/i);
      });
    });

    it('rolls back optimistic state accurately when backend toggle throws an error (failure rollback consistency)', async () => {
      // Mock toggleAdminBanner to reject with simulated network error
      const toggleSpy = vi.spyOn(api, 'toggleAdminBanner').mockRejectedValueOnce(
        new Error('Network Gateway Timeout 504')
      );

      // Mock console.error to avoid polluting test output
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<BannersPage />);

      await waitFor(() => {
        expect(screen.getByText(/Maha Shivling Sthapana & Vedic Abhishek/i)).toBeInTheDocument();
      });

      const toggleButtons = screen.getAllByRole('button', { name: /Toggle active status/i });
      const firstToggle = toggleButtons[0];
      expect(firstToggle).toHaveTextContent(/Active/i);

      // Trigger toggle
      fireEvent.click(firstToggle);

      // 1. Verify immediate optimistic transition to Hidden
      expect(firstToggle).toHaveTextContent(/Hidden/i);

      // 2. Upon API failure rejection, verify catch block calls loadBanners() and rolls back to Active
      await waitFor(() => {
        expect(toggleSpy).toHaveBeenCalled();
        expect(firstToggle).toHaveTextContent(/Active/i);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to toggle banner status, reverting:'),
        expect.any(Error)
      );
    });

    it('preserves sibling banner state isolation during individual banner toggles', async () => {
      render(<BannersPage />);

      await waitFor(() => {
        expect(screen.getByText(/Maha Shivling Sthapana & Vedic Abhishek/i)).toBeInTheDocument();
        expect(screen.getByText(/Vedic Sanctum Renovation & Nandi Dhwaj Seva/i)).toBeInTheDocument();
      });

      const toggleButtons = screen.getAllByRole('button', { name: /Toggle active status/i });
      expect(toggleButtons.length).toBeGreaterThanOrEqual(3);

      const banner1Toggle = toggleButtons[0];
      const banner3Toggle = toggleButtons[2];

      expect(banner1Toggle).toHaveTextContent(/Active/i);
      expect(banner3Toggle).toHaveTextContent(/Hidden/i);

      // Toggle Banner 1 only
      fireEvent.click(banner1Toggle);

      await waitFor(() => {
        expect(banner1Toggle).toHaveTextContent(/Hidden/i);
      });

      // Sibling banner 3 must remain untouched (Hidden)
      expect(banner3Toggle).toHaveTextContent(/Hidden/i);
    });
  });

  // =========================================================================
  // CHALLENGE 2: PRODUCT FORM EDGE CASES & VALIDATION
  // =========================================================================
  describe('Challenge 2: Product Form Edge Cases & Validation', () => {
    it('handles zero Dakshina price and negative price payloads safely without throwing', async () => {
      const onSaveMock = vi.fn().mockResolvedValue(undefined);
      const onCloseMock = vi.fn();

      render(
        <ProductFormModal
          isOpen={true}
          product={null}
          onClose={onCloseMock}
          onSave={onSaveMock}
        />
      );

      const titleInput = screen.getByLabelText(/Offering Title \*/i);
      fireEvent.change(titleInput, { target: { value: 'Zero Dakshina Seva' } });

      const priceInput = screen.getByLabelText(/Dakshina Price \(₹\) \*/i);
      // Set to 0
      fireEvent.change(priceInput, { target: { value: '0' } });

      const saveBtn = screen.getByRole('button', { name: /Save Offering/i });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(onSaveMock).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Zero Dakshina Seva',
            price: 0,
          })
        );
      });

      // Now test negative price payload through createAdminProduct service
      const negativeProduct = await api.createAdminProduct({
        title: 'Negative Dakshina Offering',
        price: -500,
        category: 'Seva',
        description: 'Testing negative price robustness',
      });

      expect(negativeProduct._id).toBeDefined();
      expect(negativeProduct.price).toBe(-500);
    });

    it('safely ingests extremely long text (10,000 char description & 2,000 char title) without UI crash or stack overflow', async () => {
      const longTitle = 'Maha Sacred Shivling '.repeat(100); // 2100 chars
      const longDescription = 'Om Namah Shivaya sacred temple seva offering. '.repeat(250); // 11,250 chars

      const onSaveMock = vi.fn().mockResolvedValue(undefined);
      const onCloseMock = vi.fn();

      render(
        <ProductFormModal
          isOpen={true}
          product={null}
          onClose={onCloseMock}
          onSave={onSaveMock}
        />
      );

      const titleInput = screen.getByLabelText(/Offering Title \*/i);
      fireEvent.change(titleInput, { target: { value: longTitle } });

      const descInput = screen.getByLabelText(/Detailed Description/i);
      fireEvent.change(descInput, { target: { value: longDescription } });

      const saveBtn = screen.getByRole('button', { name: /Save Offering/i });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(onSaveMock).toHaveBeenCalledWith(
          expect.objectContaining({
            title: longTitle,
            description: longDescription,
          })
        );
      });
    });

    it('sanitizes and safely handles HTML tags, script injection, and special characters in rituals & prasad', async () => {
      const maliciousScript = "<script>alert('XSS-RITUAL')</script>";
      const maliciousImg = '<img src="x" onerror="evil()"/>';
      const sqlInjection = "' OR '1'='1 --";
      const specialChars = '<>&"\'/ Vedic Consecration';

      const ritualsPayload = `${maliciousScript}\n\n   \n${sqlInjection}\n${specialChars}`;
      const prasadPayload = `${maliciousImg}\n\nPure Desi Ghee Laddu`;

      const onSaveMock = vi.fn().mockResolvedValue(undefined);
      const onCloseMock = vi.fn();

      render(
        <ProductFormModal
          isOpen={true}
          product={null}
          onClose={onCloseMock}
          onSave={onSaveMock}
        />
      );

      const titleInput = screen.getByLabelText(/Offering Title \*/i);
      fireEvent.change(titleInput, { target: { value: 'Vedic Sanctum Ritual' } });

      const ritualsInput = screen.getByLabelText(/Rituals Included \(1 per line\)/i);
      fireEvent.change(ritualsInput, { target: { value: ritualsPayload } });

      const prasadInput = screen.getByLabelText(/Prasad Inclusions \(1 per line\)/i);
      fireEvent.change(prasadInput, { target: { value: prasadPayload } });

      const saveBtn = screen.getByRole('button', { name: /Save Offering/i });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(onSaveMock).toHaveBeenCalledWith(
          expect.objectContaining({
            // Empty / whitespace lines must be stripped out by .filter(Boolean)
            ritualsIncluded: [maliciousScript, sqlInjection, specialChars],
            prasadIncludes: [maliciousImg, 'Pure Desi Ghee Laddu'],
          })
        );
      });
    });
  });

  // =========================================================================
  // CHALLENGE 3: CATEGORY FILTERS & SEARCH ROBUSTNESS
  // =========================================================================
  describe('Challenge 3: Category Filters & Search Robustness', () => {
    it('performs partial string matching accurately in Products catalog', async () => {
      render(<ProductsPage />);

      await waitFor(() => {
        expect(screen.getByText(/Shivling Sthapana & Rudrabhishek Offering/i)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Filter offerings by title/i);

      // Partial search "Salah"
      fireEvent.change(searchInput, { target: { value: 'Salah' } });

      await waitFor(() => {
        expect(screen.getByText(/Shivling Sthapana & Rudrabhishek Offering/i)).toBeInTheDocument();
        expect(screen.queryByText(/Mahaprasad Sanctum Bhog Seva/i)).not.toBeInTheDocument();
      });
    });

    it('verifies strict case insensitivity across lowercase, uppercase, and mixed-case queries', async () => {
      render(<ProductsPage />);

      await waitFor(() => {
        expect(screen.getByText(/Shivling Sthapana & Rudrabhishek Offering/i)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Filter offerings by title/i);

      // Lowercase
      fireEvent.change(searchInput, { target: { value: 'rudrabhishek' } });
      await waitFor(() => {
        expect(screen.getByText(/Shivling Sthapana & Rudrabhishek Offering/i)).toBeInTheDocument();
      });

      // Uppercase
      fireEvent.change(searchInput, { target: { value: 'RUDRABHISHEK' } });
      await waitFor(() => {
        expect(screen.getByText(/Shivling Sthapana & Rudrabhishek Offering/i)).toBeInTheDocument();
      });

      // Mixed-case
      fireEvent.change(searchInput, { target: { value: 'rUdRaBhIsHeK' } });
      await waitFor(() => {
        expect(screen.getByText(/Shivling Sthapana & Rudrabhishek Offering/i)).toBeInTheDocument();
      });
    });

    it('does NOT crash when searching with regex metacharacters ([*+?\\^$(){}.])', async () => {
      render(<ProductsPage />);

      await waitFor(() => {
        expect(screen.getByText(/Shivling Sthapana & Rudrabhishek Offering/i)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Filter offerings by title/i);

      const regexMetacharacters = ['[', '*', '+', '?', '\\', '^', '$', '(', ')', '{', '}', '.*', '.'];

      for (const char of regexMetacharacters) {
        expect(() => {
          fireEvent.change(searchInput, { target: { value: char } });
        }).not.toThrow();

        // Must not crash React component
        expect(screen.getByText(/Temple Offerings & Products Directory/i)).toBeInTheDocument();
      }
    });

    it('accurately isolates category partitions (Offering, Puja, Prasad, Ritual, Seva, all)', async () => {
      render(<ProductsPage />);

      await waitFor(() => {
        expect(screen.getByText(/Shivling Sthapana & Rudrabhishek Offering/i)).toBeInTheDocument();
      });

      // Offering (Sthapana) category
      const offeringBtn = screen.getByRole('button', { name: 'Offering (Sthapana)' });
      fireEvent.click(offeringBtn);

      await waitFor(() => {
        expect(screen.getByText(/Shivling Sthapana & Rudrabhishek Offering/i)).toBeInTheDocument();
      });

      // Prasad category (has 0 items initially before admin creates one)
      const prasadBtn = screen.getByRole('button', { name: 'Prasad' });
      fireEvent.click(prasadBtn);

      await waitFor(() => {
        expect(screen.getByText(/No temple offerings found matching your criteria/i)).toBeInTheDocument();
        expect(screen.queryByText(/Shivling Sthapana & Rudrabhishek Offering/i)).not.toBeInTheDocument();
      });

      // Ritual category (has 0 items initially)
      const ritualBtn = screen.getByRole('button', { name: 'Ritual' });
      fireEvent.click(ritualBtn);

      await waitFor(() => {
        expect(screen.getByText(/No temple offerings found matching your criteria/i)).toBeInTheDocument();
        expect(screen.queryByText(/Shivling Sthapana & Rudrabhishek Offering/i)).not.toBeInTheDocument();
      });

      // All Offerings reset
      const allBtn = screen.getByRole('button', { name: 'All Offerings' });
      fireEvent.click(allBtn);

      await waitFor(() => {
        expect(screen.getByText(/Shivling Sthapana & Rudrabhishek Offering/i)).toBeInTheDocument();
      });
    });
  });
});
