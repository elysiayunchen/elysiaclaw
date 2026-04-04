package ai.elysiaclaw.app.ui

import androidx.compose.runtime.Composable
import ai.elysiaclaw.app.MainViewModel
import ai.elysiaclaw.app.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
