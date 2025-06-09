import { Card, CardContent } from "../ui/card";

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto mb-6 max-w-7xl rounded-md p-4 xl:p-0 mt-3">
        <Card>
          <CardContent>
            <div className="flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:gap-6">
              <a
                className="order-2 sm:order-1 sm:flex-1"
                href="https://paynow.gg"
                target="_blank"
                rel="noreferrer"
              >
                Powered by PayNow.gg
              </a>

              <div className="order-1 flex flex-col gap-4 sm:order-2 sm:flex-row sm:items-center sm:gap-6">
                <a
                  href="https://paynow.gg/user-agreement"
                  target="_blank"
                  rel="noreferrer"
                >
                  User Agreement
                </a>

                <a
                  href="https://paynow.gg/terms-of-service"
                  target="_blank"
                  rel="noreferrer"
                >
                  Terms of Use
                </a>

                <a
                  href="https://paynow.gg/privacy-policy"
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Policy
                </a>
              </div>
            </div>{" "}
          </CardContent>
        </Card>
      </div>
    </footer>
  );
}
