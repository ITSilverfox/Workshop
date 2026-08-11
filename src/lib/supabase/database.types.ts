export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      accident_reports: {
        Row: {
          company_id: string | null
          created_at: string
          description: string | null
          driver_id: string | null
          fine_details: string | null
          id: string
          image_paths: string[]
          incident_type: string
          inspected_by: string | null
          inspector_signature_path: string | null
          location: string
          occurred_at: string
          police_report: boolean | null
          police_report_path: string | null
          police_report_type: string | null
          status: string
          total_fine: number | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          driver_id?: string | null
          fine_details?: string | null
          id?: string
          image_paths?: string[]
          incident_type: string
          inspected_by?: string | null
          inspector_signature_path?: string | null
          location: string
          occurred_at: string
          police_report?: boolean | null
          police_report_path?: string | null
          police_report_type?: string | null
          status?: string
          total_fine?: number | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          driver_id?: string | null
          fine_details?: string | null
          id?: string
          image_paths?: string[]
          incident_type?: string
          inspected_by?: string | null
          inspector_signature_path?: string | null
          location?: string
          occurred_at?: string
          police_report?: boolean | null
          police_report_path?: string | null
          police_report_type?: string | null
          status?: string
          total_fine?: number | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accident_reports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accident_reports_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accident_reports_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_users: {
        Row: {
          created_at: string
          driver_id: string | null
          email: string
          full_name: string | null
          id: string
          is_active: boolean
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          driver_id?: string | null
          email: string
          full_name?: string | null
          id: string
          is_active?: boolean
          role?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          driver_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_users_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_batches: {
        Row: {
          created_at: string
          id: string
          status: string
          sub_total: number | null
          submitted_by: string | null
          submitted_date: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          sub_total?: number | null
          submitted_by?: string | null
          submitted_date?: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          sub_total?: number | null
          submitted_by?: string | null
          submitted_date?: string
        }
        Relationships: []
      }
      chart_of_accounts: {
        Row: {
          account_code: string | null
          account_name: string
          account_type: string | null
          created_at: string
          id: string
          is_admin_expense: boolean
          parent_account: string | null
        }
        Insert: {
          account_code?: string | null
          account_name: string
          account_type?: string | null
          created_at?: string
          id?: string
          is_admin_expense?: boolean
          parent_account?: string | null
        }
        Update: {
          account_code?: string | null
          account_name?: string
          account_type?: string | null
          created_at?: string
          id?: string
          is_admin_expense?: boolean
          parent_account?: string | null
        }
        Relationships: []
      }
      companies: {
        Row: {
          code: string | null
          created_at: string
          id: string
          is_active: boolean
          name: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cost_allocation_invoices: {
        Row: {
          company_id: string
          created_at: string
          ho_cost: number | null
          id: string
          invoice_number: string | null
          invoice_value: number | null
          period_id: string
          total_cost: number | null
        }
        Insert: {
          company_id: string
          created_at?: string
          ho_cost?: number | null
          id?: string
          invoice_number?: string | null
          invoice_value?: number | null
          period_id: string
          total_cost?: number | null
        }
        Update: {
          company_id?: string
          created_at?: string
          ho_cost?: number | null
          id?: string
          invoice_number?: string | null
          invoice_value?: number | null
          period_id?: string
          total_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cost_allocation_invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cost_allocation_invoices_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "cost_allocation_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_allocation_periods: {
        Row: {
          created_at: string
          created_by: string | null
          from_date: string
          id: string
          status: string
          to_date: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          from_date: string
          id?: string
          status?: string
          to_date: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          from_date?: string
          id?: string
          status?: string
          to_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "cost_allocation_periods_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_memos: {
        Row: {
          created_at: string
          document_path: string | null
          driver_id: string
          id: string
          memo_type: string | null
          message: string
          scheduled_at: string | null
          sent_at: string | null
          status: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          document_path?: string | null
          driver_id: string
          id?: string
          memo_type?: string | null
          message: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          document_path?: string | null
          driver_id?: string
          id?: string
          memo_type?: string | null
          message?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_memos_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_memos_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          address: Json | null
          category: string | null
          company_id: string | null
          created_at: string
          date_of_birth: string | null
          driving_type: string | null
          email: string | null
          emp_id: string | null
          first_name: string
          id: string
          last_name: string | null
          license_class: string | null
          license_number: string | null
          license_state: string | null
          notes: string | null
          phone: string | null
          prefix: string | null
          profile_image_path: string | null
          suffix: string | null
          updated_at: string
          user_status: string
          user_type: string
        }
        Insert: {
          address?: Json | null
          category?: string | null
          company_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          driving_type?: string | null
          email?: string | null
          emp_id?: string | null
          first_name: string
          id?: string
          last_name?: string | null
          license_class?: string | null
          license_number?: string | null
          license_state?: string | null
          notes?: string | null
          phone?: string | null
          prefix?: string | null
          profile_image_path?: string | null
          suffix?: string | null
          updated_at?: string
          user_status?: string
          user_type?: string
        }
        Update: {
          address?: Json | null
          category?: string | null
          company_id?: string | null
          created_at?: string
          date_of_birth?: string | null
          driving_type?: string | null
          email?: string | null
          emp_id?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          license_class?: string | null
          license_number?: string | null
          license_state?: string | null
          notes?: string | null
          phone?: string | null
          prefix?: string | null
          profile_image_path?: string | null
          suffix?: string | null
          updated_at?: string
          user_status?: string
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_card_transactions: {
        Row: {
          amount: number
          bill_reference: string | null
          created_at: string
          id: string
          litres: number | null
          notes: string | null
          source: string
          transacted_at: string
          vehicle_id: string | null
        }
        Insert: {
          amount: number
          bill_reference?: string | null
          created_at?: string
          id?: string
          litres?: number | null
          notes?: string | null
          source?: string
          transacted_at: string
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          bill_reference?: string | null
          created_at?: string
          id?: string
          litres?: number | null
          notes?: string | null
          source?: string
          transacted_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fuel_card_transactions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_entries: {
        Row: {
          created_at: string
          entry_date: string
          id: string
          invoice_number: string | null
          invoice_path: string | null
          litres: number | null
          odometer_km: number
          partial_fill: boolean | null
          price_per_unit: number
          total_amount: number | null
          vehicle_id: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          entry_date?: string
          id?: string
          invoice_number?: string | null
          invoice_path?: string | null
          litres?: number | null
          odometer_km: number
          partial_fill?: boolean | null
          price_per_unit: number
          total_amount?: number | null
          vehicle_id: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          entry_date?: string
          id?: string
          invoice_number?: string | null
          invoice_path?: string | null
          litres?: number | null
          odometer_km?: number
          partial_fill?: boolean | null
          price_per_unit?: number
          total_amount?: number | null
          vehicle_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fuel_entries_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_entries_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_expense_claim_lines: {
        Row: {
          account_id: string | null
          amount_excl_vat: number | null
          claim_id: string
          company_id: string | null
          driver_id: string | null
          fuel_type: string | null
          id: string
          notes: string | null
          plate_number_text: string | null
          total_amount: number | null
          unit_price: number | null
          vat_amount: number | null
        }
        Insert: {
          account_id?: string | null
          amount_excl_vat?: number | null
          claim_id: string
          company_id?: string | null
          driver_id?: string | null
          fuel_type?: string | null
          id?: string
          notes?: string | null
          plate_number_text?: string | null
          total_amount?: number | null
          unit_price?: number | null
          vat_amount?: number | null
        }
        Update: {
          account_id?: string | null
          amount_excl_vat?: number | null
          claim_id?: string
          company_id?: string | null
          driver_id?: string | null
          fuel_type?: string | null
          id?: string
          notes?: string | null
          plate_number_text?: string | null
          total_amount?: number | null
          unit_price?: number | null
          vat_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fuel_expense_claim_lines_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_expense_claim_lines_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "fuel_expense_claims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_expense_claim_lines_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuel_expense_claim_lines_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      fuel_expense_claims: {
        Row: {
          books_jv_link: string | null
          claim_date: string
          created_at: string
          id: string
          journal_entry_number: string | null
          journal_id: string | null
          ref_no: string | null
          status: string
          updated_at: string
          vendor_name: string | null
        }
        Insert: {
          books_jv_link?: string | null
          claim_date?: string
          created_at?: string
          id?: string
          journal_entry_number?: string | null
          journal_id?: string | null
          ref_no?: string | null
          status?: string
          updated_at?: string
          vendor_name?: string | null
        }
        Update: {
          books_jv_link?: string | null
          claim_date?: string
          created_at?: string
          id?: string
          journal_entry_number?: string | null
          journal_id?: string | null
          ref_no?: string | null
          status?: string
          updated_at?: string
          vendor_name?: string | null
        }
        Relationships: []
      }
      gps_devices: {
        Row: {
          created_at: string
          id: string
          imei: string
          installed_at: string | null
          is_active: boolean
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          imei: string
          installed_at?: string | null
          is_active?: boolean
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          imei?: string
          installed_at?: string | null
          is_active?: boolean
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gps_devices_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_transactions: {
        Row: {
          amount: number | null
          created_at: string
          id: string
          item_id: string
          job_card_id: string | null
          notes: string | null
          quantity: number
          rate: number | null
          reference_no: string | null
          transaction_date: string
          transaction_type: string
          vendor_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: string
          item_id: string
          job_card_id?: string | null
          notes?: string | null
          quantity: number
          rate?: number | null
          reference_no?: string | null
          transaction_date?: string
          transaction_type: string
          vendor_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: string
          item_id?: string
          job_card_id?: string | null
          notes?: string | null
          quantity?: number
          rate?: number | null
          reference_no?: string | null
          transaction_date?: string
          transaction_type?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item_stock_levels"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_job_card_id_fkey"
            columns: ["job_card_id"]
            isOneToOne: false
            referencedRelation: "job_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      item_categories: {
        Row: {
          id: string
          name: string
          purchase_type: string | null
        }
        Insert: {
          id?: string
          name: string
          purchase_type?: string | null
        }
        Update: {
          id?: string
          name?: string
          purchase_type?: string | null
        }
        Relationships: []
      }
      items: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          item_code: string | null
          name: string
          part_number: string | null
          rate: number
          status: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          item_code?: string | null
          name: string
          part_number?: string | null
          rate?: number
          status?: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          item_code?: string | null
          name?: string
          part_number?: string | null
          rate?: number
          status?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "item_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      job_card_items: {
        Row: {
          amount: number | null
          category_id: string | null
          created_at: string
          id: string
          item_id: string | null
          item_name: string | null
          job_card_id: string
          notes: string | null
          quantity: number | null
          rate: number | null
          source_type: string
          unit: string | null
        }
        Insert: {
          amount?: number | null
          category_id?: string | null
          created_at?: string
          id?: string
          item_id?: string | null
          item_name?: string | null
          job_card_id: string
          notes?: string | null
          quantity?: number | null
          rate?: number | null
          source_type: string
          unit?: string | null
        }
        Update: {
          amount?: number | null
          category_id?: string | null
          created_at?: string
          id?: string
          item_id?: string | null
          item_name?: string | null
          job_card_id?: string
          notes?: string | null
          quantity?: number | null
          rate?: number | null
          source_type?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_card_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "item_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_card_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "item_stock_levels"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "job_card_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_card_items_job_card_id_fkey"
            columns: ["job_card_id"]
            isOneToOne: false
            referencedRelation: "job_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      job_card_labor: {
        Row: {
          amount: number | null
          created_at: string
          hours: number | null
          id: string
          job_card_id: string | null
          notes: string | null
          technician_id: string | null
          work_date: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          hours?: number | null
          id?: string
          job_card_id?: string | null
          notes?: string | null
          technician_id?: string | null
          work_date?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          hours?: number | null
          id?: string
          job_card_id?: string | null
          notes?: string | null
          technician_id?: string | null
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_card_labor_job_card_id_fkey"
            columns: ["job_card_id"]
            isOneToOne: false
            referencedRelation: "job_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_card_labor_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      job_card_status_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          job_card_id: string
          notes: string | null
          status: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          job_card_id: string
          notes?: string | null
          status: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          job_card_id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_card_status_history_job_card_id_fkey"
            columns: ["job_card_id"]
            isOneToOne: false
            referencedRelation: "job_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      job_cards: {
        Row: {
          accounts_submitted: string
          action_taken: string | null
          approval_batch_id: string | null
          cancellation_reason: string | null
          company_id: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          current_reading_km: number | null
          customer_name: string | null
          driver_name_text: string | null
          due_date: string | null
          further_remarks: string | null
          id: string
          inspection_checklist: Json
          invoice_date: string | null
          invoice_number: string | null
          invoice_path: string | null
          is_internal: boolean
          issue_description: string | null
          job_card_no: string
          labor_amount: number | null
          last_serviced_km: number | null
          next_service_km: number | null
          parts_amount: number | null
          requested_by: string | null
          rta_passing_type: string | null
          rta_status: string | null
          scheduled_date: string | null
          serial_number: string | null
          service_req_date: string
          service_type_km: string | null
          status: string
          tax_amount: number | null
          technician_inspected_id: string | null
          technician_received_id: string | null
          time_in: string | null
          time_out: string | null
          total_amount: number | null
          type_of_service: string
          under_warranty: boolean | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          accounts_submitted?: string
          action_taken?: string | null
          approval_batch_id?: string | null
          cancellation_reason?: string | null
          company_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          current_reading_km?: number | null
          customer_name?: string | null
          driver_name_text?: string | null
          due_date?: string | null
          further_remarks?: string | null
          id?: string
          inspection_checklist?: Json
          invoice_date?: string | null
          invoice_number?: string | null
          invoice_path?: string | null
          is_internal?: boolean
          issue_description?: string | null
          job_card_no: string
          labor_amount?: number | null
          last_serviced_km?: number | null
          next_service_km?: number | null
          parts_amount?: number | null
          requested_by?: string | null
          rta_passing_type?: string | null
          rta_status?: string | null
          scheduled_date?: string | null
          serial_number?: string | null
          service_req_date?: string
          service_type_km?: string | null
          status?: string
          tax_amount?: number | null
          technician_inspected_id?: string | null
          technician_received_id?: string | null
          time_in?: string | null
          time_out?: string | null
          total_amount?: number | null
          type_of_service: string
          under_warranty?: boolean | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          accounts_submitted?: string
          action_taken?: string | null
          approval_batch_id?: string | null
          cancellation_reason?: string | null
          company_id?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          current_reading_km?: number | null
          customer_name?: string | null
          driver_name_text?: string | null
          due_date?: string | null
          further_remarks?: string | null
          id?: string
          inspection_checklist?: Json
          invoice_date?: string | null
          invoice_number?: string | null
          invoice_path?: string | null
          is_internal?: boolean
          issue_description?: string | null
          job_card_no?: string
          labor_amount?: number | null
          last_serviced_km?: number | null
          next_service_km?: number | null
          parts_amount?: number | null
          requested_by?: string | null
          rta_passing_type?: string | null
          rta_status?: string | null
          scheduled_date?: string | null
          serial_number?: string | null
          service_req_date?: string
          service_type_km?: string | null
          status?: string
          tax_amount?: number | null
          technician_inspected_id?: string | null
          technician_received_id?: string | null
          time_in?: string | null
          time_out?: string | null
          total_amount?: number | null
          type_of_service?: string
          under_warranty?: boolean | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_cards_approval_batch_id_fkey"
            columns: ["approval_batch_id"]
            isOneToOne: false
            referencedRelation: "approval_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_cards_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_cards_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_cards_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_cards_technician_inspected_id_fkey"
            columns: ["technician_inspected_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_cards_technician_received_id_fkey"
            columns: ["technician_received_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_cards_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      labor_logs: {
        Row: {
          company_id: string | null
          created_at: string
          hours: number | null
          id: string
          notes: string | null
          technician_id: string
          work_date: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          hours?: number | null
          id?: string
          notes?: string | null
          technician_id: string
          work_date?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          hours?: number | null
          id?: string
          notes?: string | null
          technician_id?: string
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "labor_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labor_logs_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      odometer_readings: {
        Row: {
          created_at: string
          driver_id: string | null
          id: string
          notes: string | null
          reading_date: string
          reading_km: number
          source: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          driver_id?: string | null
          id?: string
          notes?: string | null
          reading_date?: string
          reading_km: number
          source?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string
          driver_id?: string | null
          id?: string
          notes?: string | null
          reading_date?: string
          reading_km?: number
          source?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "odometer_readings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "odometer_readings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_plates: {
        Row: {
          company_id: string | null
          created_at: string
          id: string
          plate_number: string
          plate_type: string | null
          status: string
          vehicle_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          id?: string
          plate_number: string
          plate_type?: string | null
          status?: string
          vehicle_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          id?: string
          plate_number?: string
          plate_type?: string | null
          status?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registration_plates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registration_plates_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      reminder_recipients: {
        Row: {
          driver_id: string
          reminder_id: string
        }
        Insert: {
          driver_id: string
          reminder_id: string
        }
        Update: {
          driver_id?: string
          reminder_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminder_recipients_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminder_recipients_reminder_id_fkey"
            columns: ["reminder_id"]
            isOneToOne: false
            referencedRelation: "reminders"
            referencedColumns: ["id"]
          },
        ]
      }
      reminders: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          reminder_at: string
          reminder_for: string
          renewal_type: string | null
          service_task_id: string | null
          status: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          reminder_at: string
          reminder_for: string
          renewal_type?: string | null
          service_task_id?: string | null
          status?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          reminder_at?: string
          reminder_for?: string
          renewal_type?: string | null
          service_task_id?: string | null
          status?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_service_task_id_fkey"
            columns: ["service_task_id"]
            isOneToOne: false
            referencedRelation: "service_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      reporting_tags: {
        Row: {
          id: string
          name: string
          segment: string | null
        }
        Insert: {
          id?: string
          name: string
          segment?: string | null
        }
        Update: {
          id?: string
          name?: string
          segment?: string | null
        }
        Relationships: []
      }
      service_tasks: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      technicians: {
        Row: {
          created_at: string
          designation: string | null
          email: string | null
          id: string
          is_active: boolean
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          designation?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          designation?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      toll_accounts: {
        Row: {
          account_name: string
          company_id: string | null
          created_at: string
          id: string
          notes: string | null
          tag_number: string | null
        }
        Insert: {
          account_name: string
          company_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          tag_number?: string | null
        }
        Update: {
          account_name?: string
          company_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          tag_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "toll_accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      toll_transactions: {
        Row: {
          account_id: string | null
          allocated_company_id: string | null
          amount: number
          created_at: string
          id: string
          occurred_at: string
          owned_company_id: string | null
          reference_no: string | null
          source: string
          toll_account_id: string | null
          transaction_type: string
          vehicle_id: string | null
        }
        Insert: {
          account_id?: string | null
          allocated_company_id?: string | null
          amount: number
          created_at?: string
          id?: string
          occurred_at: string
          owned_company_id?: string | null
          reference_no?: string | null
          source?: string
          toll_account_id?: string | null
          transaction_type: string
          vehicle_id?: string | null
        }
        Update: {
          account_id?: string | null
          allocated_company_id?: string | null
          amount?: number
          created_at?: string
          id?: string
          occurred_at?: string
          owned_company_id?: string | null
          reference_no?: string | null
          source?: string
          toll_account_id?: string | null
          transaction_type?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "toll_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "toll_transactions_allocated_company_id_fkey"
            columns: ["allocated_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "toll_transactions_owned_company_id_fkey"
            columns: ["owned_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "toll_transactions_toll_account_id_fkey"
            columns: ["toll_account_id"]
            isOneToOne: false
            referencedRelation: "toll_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "toll_transactions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          created_at: string
          driver_id: string
          ending_odometer: number | null
          front_image_path: string | null
          id: string
          left_image_path: string | null
          notes: string | null
          rear_image_path: string | null
          reason: string | null
          right_image_path: string | null
          signature_path: string | null
          starting_odometer: number | null
          status: string
          unassigned_at: string | null
          unassigned_by: string | null
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          driver_id: string
          ending_odometer?: number | null
          front_image_path?: string | null
          id?: string
          left_image_path?: string | null
          notes?: string | null
          rear_image_path?: string | null
          reason?: string | null
          right_image_path?: string | null
          signature_path?: string | null
          starting_odometer?: number | null
          status?: string
          unassigned_at?: string | null
          unassigned_by?: string | null
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          driver_id?: string
          ending_odometer?: number | null
          front_image_path?: string | null
          id?: string
          left_image_path?: string | null
          notes?: string | null
          rear_image_path?: string | null
          reason?: string | null
          right_image_path?: string | null
          signature_path?: string | null
          starting_odometer?: number | null
          status?: string
          unassigned_at?: string | null
          unassigned_by?: string | null
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_assignments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_assignments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_documents: {
        Row: {
          created_at: string
          doc_type: string
          document_path: string | null
          expiry_date: string | null
          id: string
          issued_date: string | null
          notes: string | null
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          doc_type: string
          document_path?: string | null
          expiry_date?: string | null
          id?: string
          issued_date?: string | null
          notes?: string | null
          vehicle_id: string
        }
        Update: {
          created_at?: string
          doc_type?: string
          document_path?: string | null
          expiry_date?: string | null
          id?: string
          issued_date?: string | null
          notes?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_documents_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_expense_ledger: {
        Row: {
          amount: number
          category: string
          company_id: string
          created_at: string
          entry_date: string
          id: string
          notes: string | null
          period_id: string | null
          quantity: number | null
          vehicle_id: string | null
        }
        Insert: {
          amount?: number
          category: string
          company_id: string
          created_at?: string
          entry_date?: string
          id?: string
          notes?: string | null
          period_id?: string | null
          quantity?: number | null
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          company_id?: string
          created_at?: string
          entry_date?: string
          id?: string
          notes?: string | null
          period_id?: string | null
          quantity?: number | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_expense_ledger_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_expense_ledger_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "cost_allocation_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_expense_ledger_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_groups: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      vehicle_handovers: {
        Row: {
          checked_by: string | null
          created_at: string
          driver_id: string | null
          driver_signature_path: string | null
          front_condition: string | null
          front_image_path: string | null
          handed_over_to: string | null
          handover_date: string
          id: string
          inspector_signature_path: string | null
          keys_ok: boolean | null
          left_condition: string | null
          left_image_path: string | null
          notes: string | null
          odometer_reading: number | null
          other_issues: Json | null
          rear_condition: string | null
          rear_image_path: string | null
          registration_card_available: boolean | null
          right_condition: string | null
          right_image_path: string | null
          status: string
          tools_spares_ok: boolean | null
          vehicle_id: string
        }
        Insert: {
          checked_by?: string | null
          created_at?: string
          driver_id?: string | null
          driver_signature_path?: string | null
          front_condition?: string | null
          front_image_path?: string | null
          handed_over_to?: string | null
          handover_date?: string
          id?: string
          inspector_signature_path?: string | null
          keys_ok?: boolean | null
          left_condition?: string | null
          left_image_path?: string | null
          notes?: string | null
          odometer_reading?: number | null
          other_issues?: Json | null
          rear_condition?: string | null
          rear_image_path?: string | null
          registration_card_available?: boolean | null
          right_condition?: string | null
          right_image_path?: string | null
          status?: string
          tools_spares_ok?: boolean | null
          vehicle_id: string
        }
        Update: {
          checked_by?: string | null
          created_at?: string
          driver_id?: string | null
          driver_signature_path?: string | null
          front_condition?: string | null
          front_image_path?: string | null
          handed_over_to?: string | null
          handover_date?: string
          id?: string
          inspector_signature_path?: string | null
          keys_ok?: boolean | null
          left_condition?: string | null
          left_image_path?: string | null
          notes?: string | null
          odometer_reading?: number | null
          other_issues?: Json | null
          rear_condition?: string | null
          rear_image_path?: string | null
          registration_card_available?: boolean | null
          right_condition?: string | null
          right_image_path?: string | null
          status?: string
          tools_spares_ok?: boolean | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_handovers_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_handovers_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_issues: {
        Row: {
          assignee_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          file_path: string | null
          id: string
          job_card_id: string | null
          priority: string
          status: string
          title: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          file_path?: string | null
          id?: string
          job_card_id?: string | null
          priority?: string
          status?: string
          title: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          file_path?: string | null
          id?: string
          job_card_id?: string | null
          priority?: string
          status?: string
          title?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_issues_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_issues_job_card_id_fkey"
            columns: ["job_card_id"]
            isOneToOne: false
            referencedRelation: "job_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_issues_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_types: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          adv_permit_expiry: string | null
          adv_permit_issue_date: string | null
          adv_permit_no: string | null
          allocated_company_id: string | null
          assignment_status: string
          batch_number: string | null
          capacity: number | null
          chassis_number: string | null
          color: string | null
          created_at: string
          current_driver_id: string | null
          depreciation_pct: number | null
          engine_number: string | null
          fuel_account_id: string | null
          fuel_type: string | null
          gps_required: boolean
          id: string
          image_path: string | null
          insurance_company: string | null
          insurance_expiry: string | null
          insurance_issue_date: string | null
          insurance_policy_no: string | null
          last_service_at: string | null
          last_updated_km: number | null
          last_updated_km_at: string | null
          net_book_value: number | null
          next_service_km: number | null
          notes: string | null
          number_of_spare_keys: number | null
          odometer_unit: string
          owned_company_id: string | null
          permit_document_path: string | null
          purchase_date: string | null
          purchase_value: number | null
          reg_account_id: string | null
          reg_expiry: string | null
          reg_number: string
          repair_account_id: string | null
          salik_tag_number: string | null
          segment_tag_id: string | null
          service_interval_km: number | null
          sold_status: string | null
          spare_keys_available: boolean | null
          starting_odometer: number | null
          updated_at: string
          user_type: string | null
          vehicle_group_id: string | null
          vehicle_name: string | null
          vehicle_status: string
          vehicle_type_id: string | null
          year_of_manufacture: number | null
        }
        Insert: {
          adv_permit_expiry?: string | null
          adv_permit_issue_date?: string | null
          adv_permit_no?: string | null
          allocated_company_id?: string | null
          assignment_status?: string
          batch_number?: string | null
          capacity?: number | null
          chassis_number?: string | null
          color?: string | null
          created_at?: string
          current_driver_id?: string | null
          depreciation_pct?: number | null
          engine_number?: string | null
          fuel_account_id?: string | null
          fuel_type?: string | null
          gps_required?: boolean
          id?: string
          image_path?: string | null
          insurance_company?: string | null
          insurance_expiry?: string | null
          insurance_issue_date?: string | null
          insurance_policy_no?: string | null
          last_service_at?: string | null
          last_updated_km?: number | null
          last_updated_km_at?: string | null
          net_book_value?: number | null
          next_service_km?: number | null
          notes?: string | null
          number_of_spare_keys?: number | null
          odometer_unit?: string
          owned_company_id?: string | null
          permit_document_path?: string | null
          purchase_date?: string | null
          purchase_value?: number | null
          reg_account_id?: string | null
          reg_expiry?: string | null
          reg_number: string
          repair_account_id?: string | null
          salik_tag_number?: string | null
          segment_tag_id?: string | null
          service_interval_km?: number | null
          sold_status?: string | null
          spare_keys_available?: boolean | null
          starting_odometer?: number | null
          updated_at?: string
          user_type?: string | null
          vehicle_group_id?: string | null
          vehicle_name?: string | null
          vehicle_status?: string
          vehicle_type_id?: string | null
          year_of_manufacture?: number | null
        }
        Update: {
          adv_permit_expiry?: string | null
          adv_permit_issue_date?: string | null
          adv_permit_no?: string | null
          allocated_company_id?: string | null
          assignment_status?: string
          batch_number?: string | null
          capacity?: number | null
          chassis_number?: string | null
          color?: string | null
          created_at?: string
          current_driver_id?: string | null
          depreciation_pct?: number | null
          engine_number?: string | null
          fuel_account_id?: string | null
          fuel_type?: string | null
          gps_required?: boolean
          id?: string
          image_path?: string | null
          insurance_company?: string | null
          insurance_expiry?: string | null
          insurance_issue_date?: string | null
          insurance_policy_no?: string | null
          last_service_at?: string | null
          last_updated_km?: number | null
          last_updated_km_at?: string | null
          net_book_value?: number | null
          next_service_km?: number | null
          notes?: string | null
          number_of_spare_keys?: number | null
          odometer_unit?: string
          owned_company_id?: string | null
          permit_document_path?: string | null
          purchase_date?: string | null
          purchase_value?: number | null
          reg_account_id?: string | null
          reg_expiry?: string | null
          reg_number?: string
          repair_account_id?: string | null
          salik_tag_number?: string | null
          segment_tag_id?: string | null
          service_interval_km?: number | null
          sold_status?: string | null
          spare_keys_available?: boolean | null
          starting_odometer?: number | null
          updated_at?: string
          user_type?: string | null
          vehicle_group_id?: string | null
          vehicle_name?: string | null
          vehicle_status?: string
          vehicle_type_id?: string | null
          year_of_manufacture?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_allocated_company_id_fkey"
            columns: ["allocated_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_current_driver_id_fkey"
            columns: ["current_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_fuel_account_id_fkey"
            columns: ["fuel_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_owned_company_id_fkey"
            columns: ["owned_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_reg_account_id_fkey"
            columns: ["reg_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_repair_account_id_fkey"
            columns: ["repair_account_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_segment_tag_id_fkey"
            columns: ["segment_tag_id"]
            isOneToOne: false
            referencedRelation: "reporting_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_vehicle_group_id_fkey"
            columns: ["vehicle_group_id"]
            isOneToOne: false
            referencedRelation: "vehicle_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_vehicle_type_id_fkey"
            columns: ["vehicle_type_id"]
            isOneToOne: false
            referencedRelation: "vehicle_types"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: Json | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
          vendor_type: string
          website: string | null
        }
        Insert: {
          address?: Json | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          vendor_type: string
          website?: string | null
        }
        Update: {
          address?: Json | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          vendor_type?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      item_stock_levels: {
        Row: {
          item_code: string | null
          item_id: string | null
          name: string | null
          quantity_on_hand: number | null
          unit: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin_or_owner: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
