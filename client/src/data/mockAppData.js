/** Mock notifications for the bell panel (frontend-only). */
export const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    title: "Draw window closes soon",
    body: "March impact draw entries lock in 4 hours.",
    time: "2h ago",
    unread: true,
  },
  {
    id: "n2",
    title: "Score logged",
    body: "Your latest round was recorded in the rolling window.",
    time: "Yesterday",
    unread: false,
  },
  {
    id: "n3",
    title: "Charity spotlight",
    body: "Partners received 94% of routed funds last cycle.",
    time: "Mar 24",
    unread: false,
  },
];

/** Mock live / upcoming draws for Live Draws page when API has sparse data. */
export const MOCK_LIVE_DRAWS = [
  {
    id: "d1",
    name: "March Impact Draw",
    status: "Open",
    closesIn: "4h 18m",
    pool: "$12,400",
    entries: "1,240",
  },
  {
    id: "d2",
    name: "Spring Classic Pool",
    status: "Closing soon",
    closesIn: "1d 02h",
    pool: "$8,900",
    entries: "892",
  },
  {
    id: "d3",
    name: "Members Weekly",
    status: "Scheduled",
    closesIn: "3d",
    pool: "$2,100",
    entries: "210",
  },
];
