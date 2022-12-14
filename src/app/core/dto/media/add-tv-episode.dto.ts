import { MediaExternalStreams, ShortDate } from '../../models';

export interface AddTVEpisodeDto {
  episodeNumber: number;
  name?: string;
  overview?: string;
  runtime: number;
  airDate: ShortDate;
  visibility: number;
  extStreams?: Partial<MediaExternalStreams>;
}
