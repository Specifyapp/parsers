import * as seeds from '../../seeds.json';
import optimizeVector from './optimize-vector.parser';
import { DownloadableFile, VectorToken } from '../../types';
import libs, { LibsType } from '../global-libs';

describe('Optimize vector', () => {
  it('Get tokens - apply parsers', async done => {
    const tokens = seeds.tokens.filter(
      ({ repository }) => repository.name === 'Repo with vector from sketch figma and feather',
    );
    const result = await optimizeVector(tokens as Array<VectorToken>, undefined, libs as LibsType);
    if (result instanceof Error) return done.fail(result);
    expect(
      (tokens.find(({ name }) => name === 'alert-circle.svg') as DownloadableFile)!.value.content,
    ).toEqual(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>',
    );
    expect(
      (tokens.find(({ name }) => name === 'from-sketch.svg') as DownloadableFile)!.value.content,
    ).toEqual(
      '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><rect id="a" x="0" y="0" width="16" height="16" rx="4"/></defs><g fill="none" fill-rule="evenodd"><mask id="b" fill="#fff"><use xlink:href="#a"/></mask><g mask="url(#b)" fill="#EB2654" opacity=".4"><path d="M0 0h16v16H0z"/></g><g mask="url(#b)" stroke="#141414" stroke-opacity=".08"><rect x=".5" y=".5" width="15" height="15" rx="4"/></g></g></svg>',
    );
    expect(
      (tokens.find(({ name }) => name === 'from-figma.svg') as DownloadableFile)!.value.content,
    ).toEqual(
      '<svg width="22" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 6.938V5.063c0-.31.253-.563.563-.563h1.875c.309 0 .562.253.562.563v1.875c0 .309-.253.562-.563.562H7.063a.564.564 0 01-.563-.563zm6.563.562h1.874c.31 0 .563-.253.563-.563V5.063a.564.564 0 00-.563-.562h-1.874a.564.564 0 00-.563.563v1.875c0 .309.253.562.563.562zm-6 4.5h1.875c.309 0 .562-.253.562-.563V9.563A.564.564 0 008.937 9H7.063a.564.564 0 00-.563.563v1.874c0 .31.253.563.563.563zm6 0h1.874c.31 0 .563-.253.563-.563V9.563A.564.564 0 0014.937 9h-1.874a.564.564 0 00-.563.563v1.874c0 .31.253.563.563.563zM9.5 15.938v-1.876a.564.564 0 00-.563-.562H7.063a.564.564 0 00-.563.563v1.874c0 .31.253.563.563.563h1.875c.309 0 .562-.253.562-.563zm3.563.562h1.874c.31 0 .563-.253.563-.563v-1.874a.564.564 0 00-.563-.563h-1.874a.564.564 0 00-.563.563v1.874c0 .31.253.563.563.563zm8.437 5.813V24H.5v-1.688c0-.309.253-.562.563-.562h.914V1.125C1.977.502 2.478 0 3.102 0h15.796c.624 0 1.125.502 1.125 1.125V21.75h.915c.309 0 .562.253.562.563zm-17.273-.61H9.5v-3.14c0-.31.253-.563.563-.563h1.874c.31 0 .563.253.563.563v3.14h5.273V2.297L4.25 2.25l-.023 19.453z" fill="#000"/></svg>',
    );
    done();
  });
  it('Get tokens - apply parsers - with config', async done => {
    const tokens = seeds.tokens.filter(
      ({ repository }) => repository.name === 'Repo with vector from sketch figma and feather',
    ) as Array<VectorToken>;
    const result = await optimizeVector(
      tokens,
      {
        svgo: {
          plugins: [
            {
              cleanupAttrs: false,
            },
            {
              removeDoctype: false,
            },
            {
              removeXMLProcInst: false,
            },
            {
              removeComments: false,
            },
            {
              removeMetadata: false,
            },
            {
              removeTitle: false,
            },
            {
              removeDesc: false,
            },
            {
              removeUselessDefs: false,
            },
            {
              removeEditorsNSData: false,
            },
            {
              removeEmptyAttrs: false,
            },
            {
              removeHiddenElems: false,
            },
            {
              removeEmptyText: false,
            },
            {
              removeEmptyContainers: false,
            },
            {
              removeViewBox: false,
            },
            {
              cleanupEnableBackground: false,
            },
            {
              convertStyleToAttrs: false,
            },
            {
              convertColors: false,
            },
            {
              convertPathData: false,
            },
            {
              convertTransform: false,
            },
            {
              removeUnknownsAndDefaults: false,
            },
            {
              removeNonInheritableGroupAttrs: false,
            },
            {
              removeUselessStrokeAndFill: false,
            },
            {
              removeUnusedNS: false,
            },
            {
              cleanupIDs: false,
            },
            {
              cleanupNumericValues: false,
            },
            {
              moveElemsAttrsToGroup: false,
            },
            {
              moveGroupAttrsToElems: false,
            },
            {
              collapseGroups: false,
            },
            {
              removeRasterImages: false,
            },
            {
              mergePaths: false,
            },
            {
              convertShapeToPath: false,
            },
            {
              sortAttrs: false,
            },
            {
              removeDimensions: false,
            },
          ],
        },
      },
      libs as LibsType,
    );
    if (result instanceof Error) return done.fail(result);
    expect(
      (tokens.find(({ name }) => name === 'alert-circle.svg') as DownloadableFile)!.value.content,
    ).toEqual(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    );
    expect(
      (tokens.find(({ name }) => name === 'from-sketch.svg') as DownloadableFile)!.value.content,
    ).toEqual(
      '<?xml version="1.0" encoding="UTF-8"?><svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Icon</title><defs><rect id="path-1" x="0" y="0" width="16" height="16" rx="4"/></defs><g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Icon"><mask id="mask-2" fill="white"><use xlink:href="#path-1"/></mask><g id="Shadow"/><g id="Group" mask="url(#mask-2)" fill="#EB2654" opacity="0.4"><g id="↳-🎨-Color"><rect x="0" y="0" width="16" height="16"/></g></g><g id="Group" mask="url(#mask-2)" stroke="#141414" stroke-opacity="0.08"><g id="↳-🔲-Border"><rect id="Shadow" x="0.5" y="0.5" width="15" height="15" rx="4"/></g></g></g></g></svg>',
    );
    expect(
      (tokens.find(({ name }) => name === 'from-figma.svg') as DownloadableFile)!.value.content,
    ).toEqual(
      '<svg width="22" height="24" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 6.9375V5.0625C6.5 4.75313 6.75313 4.5 7.0625 4.5H8.9375C9.24687 4.5 9.5 4.75313 9.5 5.0625V6.9375C9.5 7.24687 9.24687 7.5 8.9375 7.5H7.0625C6.75313 7.5 6.5 7.24687 6.5 6.9375ZM13.0625 7.5H14.9375C15.2469 7.5 15.5 7.24687 15.5 6.9375V5.0625C15.5 4.75313 15.2469 4.5 14.9375 4.5H13.0625C12.7531 4.5 12.5 4.75313 12.5 5.0625V6.9375C12.5 7.24687 12.7531 7.5 13.0625 7.5ZM7.0625 12H8.9375C9.24687 12 9.5 11.7469 9.5 11.4375V9.5625C9.5 9.25313 9.24687 9 8.9375 9H7.0625C6.75313 9 6.5 9.25313 6.5 9.5625V11.4375C6.5 11.7469 6.75313 12 7.0625 12ZM13.0625 12H14.9375C15.2469 12 15.5 11.7469 15.5 11.4375V9.5625C15.5 9.25313 15.2469 9 14.9375 9H13.0625C12.7531 9 12.5 9.25313 12.5 9.5625V11.4375C12.5 11.7469 12.7531 12 13.0625 12ZM9.5 15.9375V14.0625C9.5 13.7531 9.24687 13.5 8.9375 13.5H7.0625C6.75313 13.5 6.5 13.7531 6.5 14.0625V15.9375C6.5 16.2469 6.75313 16.5 7.0625 16.5H8.9375C9.24687 16.5 9.5 16.2469 9.5 15.9375ZM13.0625 16.5H14.9375C15.2469 16.5 15.5 16.2469 15.5 15.9375V14.0625C15.5 13.7531 15.2469 13.5 14.9375 13.5H13.0625C12.7531 13.5 12.5 13.7531 12.5 14.0625V15.9375C12.5 16.2469 12.7531 16.5 13.0625 16.5ZM21.5 22.3125V24H0.5V22.3125C0.5 22.0031 0.753125 21.75 1.0625 21.75H1.97656V1.125C1.97656 0.501562 2.47812 0 3.10156 0H18.8984C19.5219 0 20.0234 0.501562 20.0234 1.125V21.75H20.9375C21.2469 21.75 21.5 22.0031 21.5 22.3125ZM4.22656 21.7031H9.5V18.5625C9.5 18.2531 9.75313 18 10.0625 18H11.9375C12.2469 18 12.5 18.2531 12.5 18.5625V21.7031H17.7734V2.29688L4.25 2.25L4.22656 21.7031Z" fill="black"/></svg>',
    );
    done();
  });
});
