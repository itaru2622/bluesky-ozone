import client from '@/lib/client'

export const isIdRecord = (id: string) => id.startsWith('at://')

export const createSubjectFromId = async (id: string) => {
  if (isIdRecord(id)) {
    try {
      const { data: record } = await client.api.com.atproto.admin.getRecord(
        { uri: id },
        { headers: client.adminHeaders() },
      )
      return {
        $type: 'com.atproto.repo.strongRef',
        uri: record.uri,
        cid: record.cid,
      }
    } catch (err) {
      if (err?.['error'] === 'RecordNotFound') {
        // @TODO this is a roundabout way to get a record cid if the record was deleted.
        // It should work pretty well in this context, since createSubjectFromId() is generally used while resolving reports.
        const { data: reports } =
          await client.api.com.atproto.admin.getModerationReports(
            { subject: id, limit: 1 },
            { headers: client.adminHeaders() },
          )
        const report = reports.reports.at(0)
        if (!report || report.subject.uri !== id || !report.subject.cid) {
          throw err
        }
        return {
          $type: 'com.atproto.repo.strongRef',
          uri: report.subject.uri,
          cid: report.subject.cid,
        }
      }
      throw err
    }
  }
  return {
    $type: 'com.atproto.admin.defs#repoRef',
    did: id,
  }
}

export enum CollectionId {
  FeedGenerator = 'app.bsky.feed.generator',
  Profile = 'app.bsky.actor.profile',
  List = 'app.bsky.graph.list',
  Post = 'app.bsky.feed.post',
}
export const getProfileUriForDid = (did: string) =>
  `at://${did}/${CollectionId.Profile}/self`