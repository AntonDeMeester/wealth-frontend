import { ChangeEvent, FC, useState } from "react";
import { Box, Button, Dialog, TextField } from "@material-ui/core";
import { TickerSearchItem } from "src/types/stocks";
import stockService from "src/services/stockService";
import * as _ from "lodash";

interface SearchTickerModalProps {
    open: boolean;
    onClose?: () => void;
    onTickerSelected?: (ticker: TickerSearchItem) => void;
}

const SearchTickerModal: FC<SearchTickerModalProps> = ({ open, onClose, onTickerSelected }) => {
    const [matchedPositions, setMatchedPositions] = useState<TickerSearchItem[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const searchTickers = _.debounce(async (event: ChangeEvent<{ value?: string }>) => {
        const ticker = event.target?.value;
        if (!ticker) {
            return;
        }
        const response = await stockService.searchTicker(ticker);
        if (!response.data?.length) {
            setErrorMessage("No tickers found, please try again");
        } else {
            setErrorMessage("");
        }
        setMatchedPositions(response.data);
    }, 500);

    const closeModal = (newState: boolean) => {
        onClose();
        setMatchedPositions([]);
        setErrorMessage("");
    };

    const selectTicker = (ticker: TickerSearchItem) => {
        setMatchedPositions([]);
        setErrorMessage("");
        onTickerSelected(ticker);
    };

    return (
        <Dialog fullWidth maxWidth="md" onClose={closeModal} open={open}>
            <Box
                sx={{
                    backgroundColor: "background.default",
                    py: 2,
                    px: 2,
                }}
            >
                <Box sx={{ mt: 2 }}>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Search Ticker"
                        margin="normal"
                        name="searchQuery"
                        onChange={(e) => searchTickers(e)}
                        type="text"
                        variant="outlined"
                    />
                </Box>
                {matchedPositions.map((match) => (
                    <Box sx={{ mt: 2 }}>
                        <Button
                            color="primary"
                            fullWidth
                            size="large"
                            type="submit"
                            variant="outlined"
                            onClick={() => selectTicker(match)}
                        >
                            <div style={{ width: "100%" }}>
                                <p style={{ textOverflow: "ellipsis", color: "white", textAlign: "start" }}>
                                    <span>{match.name} </span>
                                    <i>({match.region})</i>
                                </p>
                            </div>
                        </Button>
                    </Box>
                ))}
                {errorMessage && (
                    <Box sx={{ mt: 2, mb: 2, px: 1 }}>
                        <p color="secondary">{errorMessage}</p>
                    </Box>
                )}
                <Box sx={{ mt: 2 }}>
                    <Button
                        color="secondary"
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        onClick={() => closeModal(false)}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

SearchTickerModal.defaultProps = {
    open: false,
};

export default SearchTickerModal;
