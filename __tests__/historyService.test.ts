// historyService.test.ts — History data service contract (mock payload shape)
// + the local-time date helpers the S4 calendar depends on.
import { historyService } from '../src/features/map/services/historyService';
import {
  buildMonthGrid,
  formatMonthCaption,
  formatShortDate,
  fromIsoDate,
  shiftMonth,
  toIsoDate,
} from '../src/features/map/utils/historyDates';

describe('historyService (history mock)', () => {
  it('returns the default payload for the default vehicle', async () => {
    const data = await historyService.getHistoryData();

    expect(data.vehicle.id).toBe('LFA-1464');
    expect(data.vehicle.name).toBe('Honda Civic (LFA-1464)');
    expect(data.range).toEqual({ from: '2018-12-13', until: '2018-12-24' });
    // the calendar cursor opens on the month that owns `from`
    expect(data.month).toEqual({ year: 2018, month: 11 });
    expect(data.summary.totalKm).toBe('23.5');
    expect(data.playback.state).toBe('Moving');
    expect(data.map.route).toHaveLength(12);
    expect(data.stops).toHaveLength(3);
  });

  it('honours an explicit range and re-anchors the month cursor', async () => {
    const data = await historyService.getHistoryData('LFA-1464', {
      from: '2019-01-05',
      until: '2019-01-09',
    });

    expect(data.range).toEqual({ from: '2019-01-05', until: '2019-01-09' });
    expect(data.month).toEqual({ year: 2019, month: 0 });
  });

  it('falls back to the default vehicle for an unknown id', async () => {
    const data = await historyService.getHistoryData('UNKNOWN-ID');

    expect(data.vehicle.id).toBe('LFA-1464');
  });

  it('lists 4 vehicles that all resolve to history data', async () => {
    const vehicles = await historyService.getHistoryVehicles();

    expect(vehicles).toHaveLength(4);
    for (const vehicle of vehicles) {
      const data = await historyService.getHistoryData(vehicle.id);
      expect(data.vehicle.id).toBe(vehicle.id);
    }
  });
});

describe('historyDates (local-time helpers)', () => {
  it('round-trips an ISO date through a local Date without drifting', () => {
    expect(toIsoDate(fromIsoDate('2018-12-13'))).toBe('2018-12-13');
  });

  it('formats the reference `dd.MM.yy` readout', () => {
    expect(formatShortDate('2018-12-13')).toBe('13.12.18');
    expect(formatShortDate('2018-12-24')).toBe('24.12.18');
  });

  it('formats the month caption', () => {
    expect(formatMonthCaption(2018, 11)).toBe('December 2018');
  });

  it('normalises month shifts across the year boundary', () => {
    expect(shiftMonth(2018, 11, 1)).toEqual({ year: 2019, month: 0 });
    expect(shiftMonth(2019, 0, -1)).toEqual({ year: 2018, month: 11 });
  });

  it('builds a 6x7 grid that starts on the Sunday of the first week', () => {
    const cells = buildMonthGrid(2018, 11);

    expect(cells).toHaveLength(42);
    // 1 Dec 2018 was a Saturday, so the row starts on Sun 25 Nov.
    expect(cells[0].date).toBe('2018-11-25');
    expect(cells[0].outside).toBe(true);
    // 1 Dec is inside the displayed month.
    const firstOfMonth = cells.find(cell => cell.date === '2018-12-01');
    expect(firstOfMonth?.outside).toBe(false);
    expect(firstOfMonth?.day).toBe(1);
  });
});
