-- A concurrent double-submit must not create multiple open reviews for one account.
CREATE UNIQUE INDEX student_applications_one_pending_per_user
  ON student_applications(user_id)
  WHERE status = 'pending';
