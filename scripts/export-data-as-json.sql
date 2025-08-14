-- Export data in JSON format for easier backup/restore
SELECT json_build_object(
  'categories', (SELECT json_agg(row_to_json(c)) FROM categories c),
  'goals', (SELECT json_agg(row_to_json(g)) FROM goals g),
  'long_term_goals', (SELECT json_agg(row_to_json(lg)) FROM long_term_goals lg),
  'tasks', (SELECT json_agg(row_to_json(t)) FROM tasks t),
  'activity_log', (SELECT json_agg(row_to_json(al)) FROM activity_log al),
  'exported_at', NOW()
) as complete_database_export;
