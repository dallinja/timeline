
insert into
public.entries (
  name,
  type,
  sub_type,
  user_id,
  scenario,
  start_year,
  end_year,
  cash_taxable,
  cash_start,
  cash_end,
  cash_rate,
  cash_recurring,
  cash_recurring_rate,
  property_start,
  property_rate,
  investments_start,
  investments_rate,
  investments_recurring,
  investments_recurring_rate,
  loans_start,
  loans_rate,
  loans_periods
)
values
  ('Initial cash', 'income', 'one-time', '1', 'default', 2023, 2023, false, 60000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
  ('Annual expenses', 'expense', 'yearly', '1', 'default', 2023, 2076, false, 0, 0, -80000, 0.02, 0, 0, 0, 0, 0, 0, 0, 0),
  ('Home', 'property', 'house', '1', 'default', 2023, 2076, false, 0, 0, -5000, 0.02, 500000, 0.025, 0, 0, 0, 0, 0, 0),
  ('Trad Existing Investment', 'investment', 'job', '1', 'default', 2023, 2049, false, 50000, 0, 0, 0, 0, 0, 50000, 0.08, 16000, 0.03, 0, 0, 0),
  ('Trad Investment Annuity', 'investment', 'job', '1', 'default', 2049, 2076, false, 0, 0, 0, 0, 0, 0, 2180679.388571163, 0.04, -133873.44914832202, 0.02, 0, 0, 0),
  ('User Testing', 'income', 'job', '1', 'default', 2023, 2028, false, 10000, 0, 150000, 0.03, 0, 0, 0, 0, 0, 0, 0, 0),
  ('Car', 'expense', 'one-time', '1', 'default', 2025, 2025, false, -60000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0),
  ('Job 2', 'income', 'job', '1', 'default', 2028, 2047, false, 0, 0, 300000, 0.03, 0, 0, 0, 0, 0, 0, 0, 0);

insert into
public.entries (
  name,
  parent_id,
  type,
  sub_type,
  user_id,
  scenario,
  start_year,
  end_year,
  cash_start,
  cash_rate,
  cash_recurring,
  cash_recurring_rate,
  property_start,
  property_rate,
  investments_start,
  investments_rate,
  investments_recurring,
  investments_recurring_rate,
  loans_start,
  loans_rate,
  loans_periods,
  cash_taxable
)
values
  ('Mortgage', 1234, 'loan', 'house', '1', 'default', 2023, 2051, 50000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 450000, 0.03, 28),
  ('Annual donation', 1700029529688125, 'expense', 'annual-donation', '1', 'default', 2023, 2028, 0, 0, -15000, 0.03, 0, 0, 0, 0, 0, 0, 0, 0);



insert into
public.entries (
  user_id,
  parent_id,
  name,
  type,
  sub_type,
  start_year,
  end_year,
  cash_taxable,
  cash_start,
  cash_end,
  cash_rate
)
values
()

-- mortgage
insert into
public.entries (
  user_id,
  parent_id,
  name,
  type,
  sub_type,
  start_year,
  end_year,
  cash_start,
  cash_recurring,
  loans_start,
  loans_rate,
  loans_periods
)
values
('b80007c7-5a32-485c-8797-a6c0d47c0158', 4, 'Mortgage', 'loan', 'house', 2023, 2053, 450000, -22929, 450000, 0.0299, 30);