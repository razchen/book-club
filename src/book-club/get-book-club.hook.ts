import { BookClubsService } from './book-clubs.service';

export const getBookClubHook =
  (service: BookClubsService) => async (req: any) => {
    const { id } = req.params;
    return service.findOne(id);
  };
