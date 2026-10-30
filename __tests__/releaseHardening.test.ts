/// <reference types="node" />
// releaseHardening.test.ts — locks the native switches that only matter in a
// production build, where R8 runs and Metro is not there to paper over mistakes.
import fs from 'fs';
import path from 'path';

const root = path.join(__dirname, '..');
const read = (relative: string) =>
  fs.readFileSync(path.join(root, relative), 'utf8');

describe('release hardening', () => {
  it('keeps the Room database constructor R8 would otherwise strip', () => {
    // react-native-maps pulls in WorkManager -> Room. Room creates its generated
    // `*_Impl` class reflectively; room-runtime 2.5's consumer rule keeps the class
    // but not the no-arg constructor, so a minified build crashes at startup with
    // "Failed to create an instance of class androidx.work.impl.WorkDatabase".
    const rules = read('android/app/proguard-rules.pro');
    expect(rules).toContain(
      '-keep class * extends androidx.room.RoomDatabase { <init>(); }',
    );
    expect(rules).toContain(
      '-keep class androidx.work.impl.WorkDatabase_Impl { *; }',
    );
  });

  it('can build a Metro-independent QA apk with -PembedBundle', () => {
    const gradle = read('android/app/build.gradle');
    expect(gradle).toContain('project.hasProperty("embedBundle")');
    expect(gradle).toContain('debuggableVariants = []');
  });
});
