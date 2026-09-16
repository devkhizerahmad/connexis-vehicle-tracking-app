// mapService.ts — Map service stub
export const mapService = {
  getLiveLocation: async (_vehicleId: string) => {
    return { lat: 31.5204, lng: 74.3587, address: 'Lahore, Pakistan' };
  },
};
