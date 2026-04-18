-- Create destinations table
create table if not exists destinations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  state text not null,
  category text not null,
  priority text not null,
  travelers text[] not null default '{}',
  note text,
  latitude double precision not null,
  longitude double precision not null,
  type text not null default 'destinations',
  created_at timestamptz not null default now()
);

-- Allow public read/write (no auth required for this private trip app)
alter table destinations enable row level security;

create policy "Public access"
  on destinations
  for all
  using (true)
  with check (true);

-- Seed: SF → NY route
insert into destinations (name, state, category, priority, travelers, note, latitude, longitude, type) values
  ('San Francisco',            'California',         'City',           'High',   array['Yujiro','Natsuki','Hirohito','Motoya'], 'Starting point. Golden Gate, Mission burritos, fog.',                               37.7749,   -122.4194, 'start'),
  ('Yosemite National Park',   'California',         'National Park',  'High',   array['Yujiro','Hirohito','Motoya'],           'El Capitan and Half Dome. Book permits early in summer.',                           37.8651,   -119.5383, 'stop'),
  ('Las Vegas',                'Nevada',             'City',           'Medium', array['Natsuki','Hirohito','Motoya'],          'The Strip at night. All-you-can-eat buffets. Day trip to Valley of Fire.',          36.1699,   -115.1398, 'stop'),
  ('Grand Canyon South Rim',   'Arizona',            'National Park',  'High',   array['Yujiro','Natsuki','Hirohito','Motoya'], 'Sunrise at Mather Point. Book lodging months in advance.',                          36.0544,   -112.1401, 'stop'),
  ('Zion National Park',       'Utah',               'National Park',  'High',   array['Yujiro','Natsuki','Motoya'],           'Narrows hike and Angels Landing. Shuttle required in peak season.',                 37.2982,   -113.0263, 'stop'),
  ('Rocky Mountain National Park', 'Colorado',       'National Park',  'Medium', array['Hirohito','Motoya'],                   'Trail Ridge Road goes above 12,000 ft. Wildlife everywhere.',                       40.4346,   -105.7079, 'stop'),
  ('Chicago',                  'Illinois',           'City',           'Medium', array['Yujiro','Natsuki','Hirohito','Motoya'], 'Deep dish pizza, The Bean, architecture river cruise.',                             41.8781,    -87.6298, 'stop'),
  ('Mammoth Cave National Park','Kentucky',          'National Park',  'Low',    array['Natsuki','Hirohito'],                  'World''s longest known cave system. Wild Cave Tour is epic.',                       37.1869,    -86.1003, 'stop'),
  ('Nashville',                'Tennessee',          'City',           'Medium', array['Yujiro','Natsuki'],                    'Live country music on Broadway. Hot chicken is a must-try.',                        36.1627,    -86.7816, 'stop'),
  ('Washington, D.C.',         'District of Columbia','City',          'High',   array['Yujiro','Natsuki','Hirohito','Motoya'], 'All Smithsonian museums are free. National Mall + monuments.',                      38.9072,    -77.0369, 'stop'),
  ('New York City',            'New York',           'City',           'High',   array['Yujiro','Natsuki','Hirohito','Motoya'], 'Final destination. Brooklyn Bridge, Central Park, real NY pizza.',                  40.7128,    -74.0060, 'goal');
