import { ActionButton } from '@/common/buttons'
import { Checkbox, FormLabel, Input, Textarea } from '@/common/forms'
import { MOD_EVENTS } from '@/mod-event/constants'
import { LabelSelector } from '@/common/labels/Selector'
import { ActionDurationSelector } from '@/reports/ModerationForm/ActionDurationSelector'
import { ModEventSelectorButton } from '@/mod-event/SelectorButton'
import { ModEventDetailsPopover } from '@/mod-event/DetailsPopover'
import { WORKSPACE_FORM_ID } from './constants'

export const WorkspacePanelActionForm = ({
  modEventType,
  setModEventType,
  onCancel,
}: {
  modEventType: string
  setModEventType: (action: string) => void
  onCancel: () => void
}) => {
  const isCommentEvent = modEventType === MOD_EVENTS.COMMENT
  const isMuteEvent = modEventType === MOD_EVENTS.MUTE
  const isTagEvent = modEventType === MOD_EVENTS.TAG
  const isLabelEvent = modEventType === MOD_EVENTS.LABEL
  const shouldShowDurationInHoursField =
    modEventType === MOD_EVENTS.TAKEDOWN || isMuteEvent
  return (
    <div className="mb-4 w-1/2">
      <div className="relative flex flex-row gap-1 items-center">
        <ModEventSelectorButton
          selectedAction={modEventType}
          isSubjectDid={false}
          hasBlobs={false}
          setSelectedAction={(action) => setModEventType(action)}
        />
        <ModEventDetailsPopover modEventType={modEventType} />
      </div>
      {shouldShowDurationInHoursField && (
        <FormLabel label="" htmlFor="durationInHours" className={`mb-3 mt-2`}>
          <ActionDurationSelector
            action={modEventType}
            labelText={isMuteEvent ? 'Mute duration' : ''}
          />
        </FormLabel>
      )}

      {isLabelEvent && (
        <div className="mt-2">
          <LabelSelector
            id="labels"
            name="labels"
            formId={WORKSPACE_FORM_ID}
            defaultLabels={[]}
          />
        </div>
      )}

      {isTagEvent && (
        <FormLabel label="Tags" className="mt-2">
          <Input
            type="text"
            id="tags"
            name="tags"
            className="block w-full"
            placeholder="Comma separated tags"
            defaultValue=""
          />
        </FormLabel>
      )}

      <div className="mt-2">
        <Textarea
          name="comment"
          placeholder="Reason for action (optional)"
          className="block w-full mb-3"
          autoFocus
        />
      </div>
      {isCommentEvent && (
        <Checkbox
          value="true"
          id="sticky"
          name="sticky"
          className="mb-3 flex items-center"
          label="Update the subject's persistent note with this comment"
        />
      )}
      <div className="flex flex-row gap-2">
        <ActionButton appearance="primary" type="submit" size="sm">
          Submit Action
        </ActionButton>
        <ActionButton
          appearance="outlined"
          type="button"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </ActionButton>
      </div>
    </div>
  )
}
